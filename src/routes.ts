import { Router, Request, Response } from "express";
import { data } from "./data";

export const routes = Router();

routes.get("/cities", (req: Request, res: Response) => {
    const result = data.cities.map((city) => ({
        zipCode: city.zipCode,
        name: city.name,
    }));

    res.status(200).json(result);
});

routes.get("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({});
    }

    return res.status(200).json({
        zipCode: city.zipCode,
        name: city.name,
    });
});

routes.post("/cities", (req: Request, res: Response) => {
    const { zipCode, name } = req.body;

    if (!zipCode || !name) {
        return res.status(400).json({});
    }

    data.cities.push({ zipCode, name });

    res.status(201).json({});
});

routes.put("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({});
    }

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({});
    }

    city.name = name;

    return res.status(200).json({
        zipCode: city.zipCode,
        name: city.name,
    });
});

routes.delete("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({});
    }

    data.cities = data.cities.filter((city) => city.zipCode !== zipCode);
    data.weatherBulletins = data.weatherBulletins.filter(
        (bulletin) => bulletin.zipCode !== zipCode
    );

    return res.status(200).json({});
});

routes.get("/cities/:zipCode/weather", (req: Request, res: Response) => {
    const { zipCode } = req.params;

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({});
    }

    const bulletins = data.weatherBulletins.filter(
        (bulletin) => bulletin.zipCode === zipCode
    );

    if (bulletins.length === 0) {
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

    return res.status(200).json({
        zipCode,
        name: city.name,
        weather,
    });
});

routes.post("/cities/:zipCode/weather", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    const { zipCode: bodyZipCode, weather } = req.body;

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({});
    }

    if (bodyZipCode && bodyZipCode !== zipCode) {
        return res.status(400).json({});
    }

    if (weather !== "pluie" && weather !== "beau" && weather !== "neige") {
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

    return res.status(201).json({ id });
});

routes.delete("/weather/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const numericId = Number(id);

    const exists = data.weatherBulletins.some(
        (bulletin) => bulletin.id === numericId
    );

    if (!exists) {
        return res.status(404).json({});
    }

    data.weatherBulletins = data.weatherBulletins.filter(
        (bulletin) => bulletin.id !== numericId
    );

    return res.status(200).json({});
});

routes.get("/cities/:zipCode/weather/:id", (req: Request, res: Response) => {
    const { zipCode, id } = req.params;
    const numericId = Number(id);

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({});
    }

    const bulletin = data.weatherBulletins.find(
        (bulletin) => bulletin.id === numericId && bulletin.zipCode === zipCode
    );
    if (!bulletin) {
        return res.status(404).json({});
    }

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

    const bulletin = data.weatherBulletins.find(
        (bulletin) => bulletin.id === numericId
    );
    if (!bulletin) {
        return res.status(404).json({});
    }

    const city = data.cities.find(
        (city) => city.zipCode === bulletin.zipCode
    );

    return res.status(200).json({
        id: bulletin.id,
        zipCode: bulletin.zipCode,
        townName: city ? city.name : "",
        weather: bulletin.weather,
    });
});

routes.get("/weather", (req: Request, res: Response) => {
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

    res.status(200).json(result);
});
