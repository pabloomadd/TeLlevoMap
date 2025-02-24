import { IViaje } from "./IViaje";

export interface IUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  vehicle: IVehicle;
  usrType: string;
  activeTrip: IViaje;
}

export interface IVehicle {
  id: number;
  brand: string;
  model: string;
  year: string;
  licPlate: string;
  color: string;
}
