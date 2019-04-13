export class Course{
    private _id:        number;
    private _subjectID: number;
    private _teacherID: number;
    private _subjectName: string;
    private _teacherName: string;
    private _teacherSurname: string;

    get subjectName(): string { return this._subjectName }
    get teacherName(): string { return this._teacherName }
    get teacherSurname(): string { return this._teacherSurname }
    get id(): number { return this._id }
    get subjectID(): number { return this._subjectID }
    get teacherID(): number { return this._teacherID }


    constructor(id: number, teacherID: number, teacherName: string, teacherSurname, subjectID: number, subjectName: string){
        this._id = id
        this._subjectID = subjectID
        this._teacherID = teacherID
        this._subjectName = subjectName
        this._teacherName = teacherName
        this._teacherSurname = teacherSurname
    }
}