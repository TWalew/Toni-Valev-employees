import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import { GlobalContext } from "../../App";
import { ILongestMatch } from "./types";

export const LongestMatch: ILongestMatch = observer(() => {
	const {
		store: {
			employeesStore: { longestWorkingPairs },
		},
	} = useContext(GlobalContext);

	if (longestWorkingPairs.length <= 0) {
		return null;
	}

	const { employeeID1, employeeID2, daysWorked, projectID } =
		longestWorkingPairs[0];

	return (
		<>
			<hr className="m-5" />
			<div className="d-flex justify-content-center text-warning h1">
				The longest working pair is between employee {employeeID1} and
				employee {employeeID2} for project {projectID} and is in total{" "}
				{daysWorked} days. &#128526;
			</div>
		</>
	);
});
