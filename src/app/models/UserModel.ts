export class UserModel {

    constructor(
        public id: number,
        public name: string,
        public last_name: string,
        public email: string,
        public type: string,
        public username: string,
        public password: string,
    ) {
    }

    
}