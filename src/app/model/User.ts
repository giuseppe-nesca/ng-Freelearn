export class User {
    private _id:      number;
    private _name:    string;
    private _surname: string;
    private _email:   string;
    private _role:    string;

    get id(): number { return this._id }
    get name(): string { return this._name }
    get surname(): string { return this._surname }
    get email(): string { return this._email }
    get role(): string { return this._role }

    constructor(id: number, name: string, surname: string, email?: string, role?: string){
        this._id = id
        this._name = name
        this._surname = surname
        this._email = email
        this._role = role
    }
}
