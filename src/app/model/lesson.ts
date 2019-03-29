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

    constructor(id: number, userID: number, courseID: number, date: string, slot: number, status: string, done: boolean, subjectID: number, teacherID: number){
        this._id = id
        this._userID = userID
        this._courseID = courseID
        this._date = date
        this._status = status
        this._done = done
        this._subjectID = subjectID
        this._teacherID = teacherID
    }
}
