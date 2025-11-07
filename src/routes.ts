import { Router, Request, Response } from "express";
import { data } from "./data";

export const routes = Router();

routes.get("/cities", (req: Request, res: Response) => {
    console.log("Liste des villes.");
    const result = data.cities.map((city) => ({
        zipCode: city.zipCode,
        name: city.name,
    }));

    res.status(200).json(result);
});

routes.get("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    console.log(`Détail d'une ville.`);
    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        console.warn(`Ville introuvable.`);
        return res.status(404).json({});
    }
    console.log(`Ville trouvée.`);
    return res.status(200).json({
        zipCode: city.zipCode,
        name: city.name,
    });
});

routes.post("/cities", (req: Request, res: Response) => {
    const { zipCode, name } = req.body;
    console.log(`Création d'une ville.`);
    if (!zipCode || !name) {
        console.warn(`Impossible d'ajouter la ville.`);
        return res.status(400).json({});
    }

    data.cities.push({ zipCode, name });

    res.status(201).json({});
});

routes.put("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    const { name } = req.body;
    console.log(`Modification demandée.`);
    if (!name) {
        console.warn(`Impossible de modifier car le champ name est manquant.`);
        return res.status(400).json({});
    }

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        console.warn(`Impossible de modifier car la ville n'existe pas.`);
        return res.status(404).json({});
    }

    city.name = name;

    console.log(`Modification réussie.`);
    return res.status(200).json({
        zipCode: city.zipCode,
        name: city.name,
    });
});

routes.delete("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    console.log(`Suppression demandée`);
    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        console.warn(`Impossible car la ville est introuvable`);
        return res.status(404).json({});
    }

    data.cities = data.cities.filter((city) => city.zipCode !== zipCode);
    data.weatherBulletins = data.weatherBulletins.filter(
        (bulletin) => bulletin.zipCode !== zipCode
    );
    console.log(`La ville et bulletins sont supprimés`);
    return res.status(200).json({});
});




routes.get("/cities/:zipCode/weather", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    console.log(`Demande de la météo de la ville`);

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        console.warn(`Ville introuvable`);
        return res.status(404).json({});
    }

    const bulletins = data.weatherBulletins.filter(
        (bulletin) => bulletin.zipCode === zipCode
    );

    if (bulletins.length === 0) {
        console.warn(`Aucun bulletin trouvé pour cette ville`);
        return res.status(404).json({});
    }

    const counts = { pluie: 0, beau: 0, neige: 0 };

    bulletins.forEach((bulletin) => {
        counts[bulletin.weather] = counts[bulletin.weather] + 1;
    });

    let weather: "pluie" | "beau" | "neige" = "pluie";
    let max = -1;

    (["pluie", "beau", "neige"] as const).forEach((type) => {
        if (counts[type] > max) {
            max = counts[type];
            weather = type;
        }
    });

    console.log(`Météo dominante: ${weather}`);

    return res.status(200).json({
        zipCode,
        name: city.name,
        weather,
    });
});

routes.post("/cities/:zipCode/weather", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    const { zipCode: bodyZipCode, weather } = req.body;
    console.log(`Ajout d'un nouveau bulletin`);

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        console.warn(`Ville introuvable`);
        return res.status(404).json({});
    }

    if (bodyZipCode && bodyZipCode !== zipCode) {
        console.warn(`Mauvais code postal`);
        return res.status(400).json({});
    }

    if (weather !== "pluie" && weather !== "beau" && weather !== "neige") {
        console.warn(`Type de météo invalide`);
        return res.status(400).json({});
    }

    const lastId =
        data.weatherBulletins.length > 0
            ? data.weatherBulletins[data.weatherBulletins.length - 1].id
            : 0;

    const id = lastId + 1;

    data.weatherBulletins.push({
        id,
        zipCode,
        weather,
    });

    console.log(`Bulletin ajouté`);
    return res.status(201).json({ id });
});

routes.delete("/weather/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const numericId = Number(id);
    console.log(`Suppression d'un bulletin météo`);

    const exists = data.weatherBulletins.some(
        (bulletin) => bulletin.id === numericId
    );

    if (!exists) {
        console.warn(`Bulletin introuvable`);
        return res.status(404).json({});
    }

    data.weatherBulletins = data.weatherBulletins.filter(
        (bulletin) => bulletin.id !== numericId
    );

    console.log(`Bulletin supprimé avec succès`);
    return res.status(200).json({});
});

routes.get("/cities/:zipCode/weather/:id", (req: Request, res: Response) => {
    const { zipCode, id } = req.params;
    const numericId = Number(id);
    console.log(`Détail d’un bulletin météo demandé`);

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        console.warn(`Ville introuvable`);
        return res.status(404).json({});
    }

    const bulletin = data.weatherBulletins.find(
        (bulletin) => bulletin.id === numericId && bulletin.zipCode === zipCode
    );
    if (!bulletin) {
        console.warn(`Bulletin introuvable`);
        return res.status(404).json({});
    }

    console.log(`Bulletin trouvé`);
    return res.status(200).json({
        id: bulletin.id,
        zipCode: bulletin.zipCode,
        townName: city.name,
        weather: bulletin.weather,
    });
});

routes.get("/weather/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const numericId = Number(id);
    console.log(`Détail global d’un bulletin demandé`);

    const bulletin = data.weatherBulletins.find(
        (bulletin) => bulletin.id === numericId
    );
    if (!bulletin) {
        console.warn(`Bulletin introuvable`);
        return res.status(404).json({});
    }

    const city = data.cities.find(
        (city) => city.zipCode === bulletin.zipCode
    );

    console.log(`Bulletin trouvé`);
    return res.status(200).json({
        id: bulletin.id,
        zipCode: bulletin.zipCode,
        townName: city ? city.name : "",
        weather: bulletin.weather,
    });
});

routes.get("/weather", (req: Request, res: Response) => {
    console.log("Liste complète des bulletins météo demandée");

    const result = data.weatherBulletins.map((bulletin) => {
        const city = data.cities.find(
            (city) => city.zipCode === bulletin.zipCode
        );
        return {
            zipCode: bulletin.zipCode,
            townName: city ? city.name : "",
            weather: bulletin.weather,
        };
    });

    console.log(`Bulletins retournés`);
    res.status(200).json(result);
});