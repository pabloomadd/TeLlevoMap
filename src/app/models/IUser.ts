export interface IUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  vehicle: Vehicle;
  usrType: string;
}

export interface Vehicle {
  id: number;
  brend: string;
  model: string;
  year: string;
  licPlate: string;
  color: string;
}
