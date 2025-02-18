import { IViaje } from "./IViaje";

export interface IUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  vehicle: Vehicle;
  usrType: string;
  activeTrip: IViaje;
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: string;
  licPlate: string;
  color: string;
}
