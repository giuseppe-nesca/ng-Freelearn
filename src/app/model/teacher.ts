export class Teacher {
    private _id: number
    private _name: string
    private _surname: string
    get id(): number { return this._id }
    get name(): string { return this._name }
    get surname(): string { return this._surname }

    constructor(id: number, name: string, surname: string) {
        this._id = id
        this._name = name
        this._surname = surname
    }
}
