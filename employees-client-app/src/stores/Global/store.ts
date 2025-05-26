import { makeObservable, action } from "mobx";
import { EmployeesStore } from "../Employees";

export class GlobalStore {
	employeesStore: EmployeesStore;

	constructor() {
		this.employeesStore = new EmployeesStore();
		makeObservable(this);
	}
}
