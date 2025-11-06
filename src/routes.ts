import { Router, Request, Response } from "express";
import { data } from "./data";

export const routes = Router();

routes.get("/cities", (req: Request, res: Response) => {
    const result = data.cities.map(({ zipCode, name }) => ({ zipCode, name }));
    res.json(result);
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

routes.put("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    const { name } = req.body;

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (city) {
        city.name = name;
    }
    res.json({});
});

routes.post("/cities", (req: Request, res: Response) => {
    const { zipCode, name } = req.body;
    data.cities.push({ zipCode, name });
    res.json({});
});

routes.get("/cities/:zipCode/weather", (req: Request, res: Response) => {
    const { zipCode } = req.params;

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({});
    }

    const bulletins = data.weatherBulletins.filter((b) => b.zipCode === zipCode);
    if (bulletins.length === 0) {
        return res.status(404).json({});
    }

    const counts: Record<string, number> = { pluie: 0, beau: 0, neige: 0 };
    for (const b of bulletins) counts[b.weather] = (counts[b.weather] ?? 0) + 1;

    let dominant: "pluie" | "beau" | "neige" = "pluie";
    let max = -1;
    (["pluie", "beau", "neige"] as const).forEach((k) => {
        if (counts[k] > max) {
            max = counts[k];
            dominant = k;
        }
    });

    return res.status(200).json({
        zipCode,
        name: city.name,
        weather: dominant,
    });
});

routes.post("/cities/:zipCode/weather", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    const { weather } = req.body;

    const lastId =
        data.weatherBulletins.length > 0
            ? data.weatherBulletins[data.weatherBulletins.length - 1].id
            : 0;

    data.weatherBulletins.push({
        id: lastId + 1,
        zipCode,
        weather,
    });

    res.json({});
});

routes.delete("/weather/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const numericId = Number(id);

    data.weatherBulletins = data.weatherBulletins.filter(
        (bulletin) => bulletin.id !== numericId
    );

    res.json({});
});

routes.get("/cities/:zipCode/weather/:id", (req: Request, res: Response) => {
    const { zipCode, id } = req.params;
    const numericId = Number(id);

    const city = data.cities.find((city) => city.zipCode === zipCode);
    if (!city) {
        return res.status(404).json({});
    }

    const bulletin = data.weatherBulletins.find(
        (b) => b.id === numericId && b.zipCode === zipCode
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

    res.json(numericId ?? {});
});

routes.get("/weather", (req: Request, res: Response) => {
    const result = data.weatherBulletins.map((bulletin) => {
        const city = data.cities.find((city) => city.zipCode === bulletin.zipCode);
        return {
            zipCode: bulletin.zipCode,
            townName: city ? city.name : undefined,
            weather: bulletin.weather,
        };
    });

    res.json(result);
});
