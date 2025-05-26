export interface IProject {
	projectID: number;
	startDate: Date;
	endDate: Date;
}

export interface IEmployee {
	empID: number;
	projectID: number;
	dateFrom: string;
	dateTo: string;
}

export interface IMatchedEmployees {
	employeeID1: number;
	employeeID2: number;
	projectID: number;
	daysWorked: number;
}

export interface IRequestResult {
	allPairs: IMatchedEmployees[];
	employees: IEmployee[];
	longestWorkingPairs: IMatchedEmployees[];
}
