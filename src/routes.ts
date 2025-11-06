import { Router, Request, Response } from "express";
import { data } from "./data";

export const routes = Router();

routes.get("/cities", (req: Request, res: Response) => {
    const result = data.cities.map(({ zipCode, name }) => ({ zipCode, name }));
    res.status(200).json(result);
});
