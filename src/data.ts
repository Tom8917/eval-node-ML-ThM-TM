export type City = {
    zipCode: string;
    name: string;
};

export type WeatherType = "pluvieux" | "ensoleillé" | "neigeux";

export type WeatherBulletin = {
    id: number;
    zipCode: string;
    weather: WeatherType;
};

export const data = {
    cities: [] as City[],
    weatherBulletins: [] as WeatherBulletin[],
};