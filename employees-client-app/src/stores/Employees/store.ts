import { makeObservable, observable, action } from "mobx";
import { IEmployee, IMatchedEmployees, IRequestResult } from "./types";

export class EmployeesStore {
	@observable employees: IEmployee[] = [];
	@observable employeesMatchData: IMatchedEmployees[] = [];
	@observable longestWorkingPairs: IMatchedEmployees[] = [];

	daysAcs: boolean = false;

	constructor() {
		makeObservable(this);
	}

	@action
	setMatchedEmployees = (matchData: IMatchedEmployees[]) => {
		this.employeesMatchData = matchData;
	};

	@action
	setEmployees = (employees: IEmployee[]) => {
		this.employees = employees;
	};

	@action
	setLongestWorkingPairs = (longestWorkingPairs: IMatchedEmployees[]) => {
		this.longestWorkingPairs = longestWorkingPairs;
	};

	@action
	sortByDays = () => {
		this.daysAcs = !this.daysAcs;
		this.employeesMatchData = this.employeesMatchData.sort((l, r) => {
			return l.daysWorked > r.daysWorked
				? this.daysAcs
					? 1
					: -1
				: l.daysWorked < r.daysWorked
				? this.daysAcs
					? -1
					: 1
				: 0;
		});
	};

	makeRequest = () => {
		const input = document.createElement("input");
		input.type = "file";

		input.onchange = (e: any) => {
			const file = e.target.files?.[0];
			const reader = new FileReader();
			reader.readAsText(file, "UTF-8");

			reader.onload = () => {
				const formData = new FormData();
				formData.append("file", file);

				fetch("https://localhost:7186/employees/upload", {
					method: "POST",
					body: formData,
				}).then((request) => {
					request.json().then((result: IRequestResult) => {
						this.setMatchedEmployees(result.allPairs);
						this.setEmployees(result.employees);
						this.setLongestWorkingPairs(result.longestWorkingPairs);
					});
				});
			};
		};

		input.click();
	};
}
