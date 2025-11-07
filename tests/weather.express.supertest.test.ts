import { describe, it, beforeEach, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { resetData, data } from "../src/data";


describe("Weather API", () => {
    beforeEach(() => {
        resetData();
    });

    it("GET /cities → 200 avec la liste des villes", async () => {
        const res = await request(app).get("/cities");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("zipCode");
        expect(res.body[0]).toHaveProperty("name");
    });

    it("GET /cities/:zipCode → 200 si existe, 404 sinon", async () => {
        const ok = await request(app).get("/cities/21001");
        expect(ok.status).toBe(200);
        expect(ok.body.zipCode).toBe("21001");

        const notFound = await request(app).get("/cities/99999");
        expect(notFound.status).toBe(404);
    });

    it("POST /cities → 201 puis GET /cities/:zipCode → 200", async () => {
        const create = await request(app)
            .post("/cities")
            .send({ zipCode: "22000", name: "TestVille" });
        expect(create.status).toBe(201);

        const get = await request(app).get("/cities/22000");
        expect(get.status).toBe(200);
        expect(get.body.name).toBe("TestVille");
    });

    it("PUT /cities/:zipCode → 200 si ville existe, 404 sinon, 400 si name manquant", async () => {
        const badBody = await request(app)
            .put("/cities/21001")
            .send({});
        expect(badBody.status).toBe(400);

        const ok = await request(app)
            .put("/cities/21001")
            .send({ name: "Dijon Modifiee" });
        expect(ok.status).toBe(200);
        expect(ok.body.name).toBe("Dijon Modifiee");

        const notFound = await request(app)
            .put("/cities/99999")
            .send({ name: "Nope" });
        expect(notFound.status).toBe(404);
    });

    it("DELETE /cities/:zipCode → 200 si existe, 404 sinon", async () => {
        const ok = await request(app).delete("/cities/21001");
        expect(ok.status).toBe(200);

        const again = await request(app).delete("/cities/21001");
        expect(again.status).toBe(404);
    });

    it("POST /cities/:zipCode/weather → 201 {id}, 404 si ville inconnue, 400 si invalide", async () => {
        const notFound = await request(app)
            .post("/cities/99999/weather")
            .send({ weather: "pluie" });
        expect(notFound.status).toBe(404);

        const badWeather = await request(app)
            .post("/cities/21001/weather")
            .send({ weather: "orage" });
        expect(badWeather.status).toBe(400);

        const ok = await request(app)
            .post("/cities/21001/weather")
            .send({ weather: "pluie" });
        expect(ok.status).toBe(201);
        expect(ok.body).toHaveProperty("id");
    });

    it("GET /cities/:zipCode/weather → 200 avec tendance ou 404 si rien", async () => {

        await request(app)
            .post("/cities/21001/weather")
            .send({ weather: "pluie" });
        await request(app)
            .post("/cities/21001/weather")
            .send({ weather: "beau" });
        await request(app)
            .post("/cities/21001/weather")
            .send({ weather: "pluie" });

        const res = await request(app).get("/cities/21001/weather");
        expect(res.status).toBe(200);
        expect(res.body.weather).toBe("pluie");
    });

    it("GET /weather/:id et GET /cities/:zipCode/weather/:id → 200/404 cohérents", async () => {
        const create = await request(app)
            .post("/cities/21001/weather")
            .send({ weather: "neige" });
        const id = create.body.id;

        const byCity = await request(app).get(
            `/cities/21001/weather/${id}`
        );
        expect(byCity.status).toBe(200);
        expect(byCity.body.id).toBe(id);

        const global = await request(app).get(`/weather/${id}`);
        expect(global.status).toBe(200);
        expect(global.body.id).toBe(id);

        const notFound = await request(app).get(`/weather/99999`);
        expect(notFound.status).toBe(404);
    });

    it("DELETE /weather/:id → 200 si supprimé, 404 sinon", async () => {
        const create = await request(app)
            .post("/cities/21001/weather")
            .send({ weather: "beau" });
        const id = create.body.id;

        const ok = await request(app).delete(`/weather/${id}`);
        expect(ok.status).toBe(200);

        const again = await request(app).delete(`/weather/${id}`);
        expect(again.status).toBe(404);
    });

    it("GET /weather → 200 avec un tableau", async () => {
        await request(app)
            .post("/cities/21001/weather")
            .send({ weather: "pluie" });

        const res = await request(app).get("/weather");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
