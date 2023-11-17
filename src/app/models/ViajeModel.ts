export class ViajeModel {

    constructor(
        public id: number,
        public nombre: string,
        public conductor: number,
        public cantAsientosDisp: number,
        public lugarInicio: string,
        public lugarDestino: string,
        public estado: number,
    ) {
    }

    
}