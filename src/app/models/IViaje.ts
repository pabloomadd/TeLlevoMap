export interface IViaje {

    id: number,
    nombre: string,
    driver: string,
    seat1: number,
    seat2: number,
    seat3: number,
    seat4: number,
    start: ILocation,
    end: ILocation,
    state: string,
}

export interface ILocation {
  id: number
  name: string;
  latitude: number;
  longitude: number;
}
