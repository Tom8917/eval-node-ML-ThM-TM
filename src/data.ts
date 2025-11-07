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

const initialWeatherBulletins: WeatherBulletin[] = [
    { id: 1, zipCode: "21001", weather: "pluie" },
    { id: 2, zipCode: "21002", weather: "beau" },
    { id: 3, zipCode: "21003", weather: "neige" },
];

export const data = {
    cities: [...initialCities],
    weatherBulletins: [...initialWeatherBulletins],
};

export function resetData() {
    data.cities = [...initialCities];
    data.weatherBulletins = [...initialWeatherBulletins];
}
