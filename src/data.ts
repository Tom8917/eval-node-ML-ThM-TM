export type City = {
    zipCode: string;
    name: string;
};

export type WeatherType = "pluie" | "beau" | "neige";

export type WeatherBulletin = {
    id: number;
    zipCode: string;
    weather: WeatherType;
};

const initialCities: City[] = [
    { zipCode: "21001", name: "Dijon1" },
    { zipCode: "21002", name: "Dijon2" },
    { zipCode: "21003", name: "Dijon3" },
];

const initialWeatherBulletins: WeatherBulletin[] = [];

export const data = {
    cities: [...initialCities],
    weatherBulletins: [...initialWeatherBulletins],
};

export function resetData() {
    data.cities = [...initialCities];
    data.weatherBulletins = [...initialWeatherBulletins];
}
