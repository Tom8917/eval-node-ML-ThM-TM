import { Router, Request, Response } from "express";
import { data } from "./data";

export const routes = Router();

routes.get("/cities", (req: Request, res: Response) => {
    const result = data.cities.map(({ zipCode, name }) => ({ zipCode, name }));
    res.json(result);
});

routes.get("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    const cityData = data.cities.find((cityData) => cityData.zipCode === zipCode);
    res.json({});
});

routes.delete("/cities/:zipCode", (req: Request, res: Response) => {
    const { zipCode } = req.params;
    data.cities = data.cities.filter((city) => city.zipCode !== zipCode);
    res.json({});
});

