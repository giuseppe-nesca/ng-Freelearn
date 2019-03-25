export class Subject {
    private _id: number;
    private _name: string;
    get id(): number { return this._id }
    get name(): string { return this._name }
    
    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }
}