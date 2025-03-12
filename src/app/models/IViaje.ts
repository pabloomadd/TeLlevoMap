import { IUser } from './IUser';

export interface IViaje {
  id: number;
  nombre: string;
  driver: IUser;
  seat1: number;
  seat2: number;
  seat3: number;
  seat4: number;
  start: ILocation;
  end: ILocation;
  state: boolean;
  seat1Loc: number[];
  seat2Loc: number[];
  seat3Loc: number[];
  seat4Loc: number[];
}

export interface ILocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}
