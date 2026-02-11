import IPatient from "./IPatient";

export default interface IModalCalendar {
	state: boolean;
	updateStateTrue: () => void;
	updateStateFalse: () => void;
	callAPI: (requestData: any) => Promise<any>;
	responseAPI?: IPatient[];
}
