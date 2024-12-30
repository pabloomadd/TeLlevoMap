import { ILocation } from "./ILocation";

export interface IViaje {

    id: number,
    nombre: string,
    driver: string,
    seat1: boolean,
    seat2: boolean,
    seat3: boolean,
    seat4: boolean,
    start: ILocation,
    end: ILocation,
    state: string,
}
