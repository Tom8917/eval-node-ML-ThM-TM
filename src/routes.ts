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
    res.json(city ?? {});
});

routes.delete("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    data.cities = data.cities.filter((city) => city.zipCode !== zipCode);
    res.json({});
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
    res.json({});
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

    const bulletin = data.weatherBulletins.find(
        (bulletin) => bulletin.id === numericId && bulletin.zipCode === zipCode
    );

    res.json({});
});
