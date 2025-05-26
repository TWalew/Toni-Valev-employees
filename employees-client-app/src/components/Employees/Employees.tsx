import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Table } from "react-bootstrap";
import cnames from "classnames";

import { GlobalContext } from "../../App";
import { IEmployees } from "./types";

import "./styles.scss";

export const Employees: IEmployees = observer(() => {
	const {
		store: {
			employeesStore: { sortByDays, employeesMatchData, daysAcs },
		},
	} = useContext(GlobalContext);

	if (employeesMatchData.length <= 0) {
		return null;
	}

	return (
		<>
			<hr className="m-5" />
			<div className="d-flex justify-content-center">
				<Table striped bordered hover responsive variant="dark">
					<thead>
						<tr>
							<th>Employee ID 1</th>
							<th>Employee ID 2</th>
							<th>Project ID</th>
							<th className=" pointer-event" onClick={sortByDays}>
								Days Worked{" "}
								<span
									className={cnames("chevron", {
										bottom: daysAcs,
									})}></span>
							</th>
						</tr>
					</thead>
					<tbody>
						{employeesMatchData.map((match) => (
							<tr
								key={`${match.employeeID1}-${match.employeeID2}-${match.projectID}-${match.daysWorked}`}>
								<td>{match.employeeID1}</td>
								<td>{match.employeeID2}</td>
								<td>{match.projectID}</td>
								<td>{match.daysWorked}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		</>
	);
});
