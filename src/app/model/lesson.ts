export class Lesson {
    private _id:        number;
    private _userID:    number;
    private _courseID:  number;
    private _date:      string;
    private _slot:      number;
    private _status:    string;
    private _done:      boolean;
    private _subjectID: number;
    private _teacherID: number;
    private _subjectString: string;
    private _teacherString: string;

    get date(): string { return this._date }
    get slot(): number { return this._slot }
    get subject(): string { return this._subjectString }
    get teacher(): string { return this._teacherString }


    constructor(id: number, userID: number, courseID: number, date: string, slot: number, status: string, done: boolean, subjectID: number, teacherID: number, subjectString: string, teacherString: string){
        this._id = id
        this._userID = userID
        this._courseID = courseID
        this._date = date
        this._slot = slot
        this._status = status
        this._done = done
        this._subjectID = subjectID
        this._teacherID = teacherID
        this._subjectString = subjectString
        this._teacherString = teacherString
    }
}
