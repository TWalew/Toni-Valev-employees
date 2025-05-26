import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Button, Table } from "react-bootstrap";

import { GlobalContext } from "../../App";
import { Employees } from "../Employees/Employees";
import { LongestMatch } from "../LongestMatch/LongestMatch";
import { ILayout } from "./types";

export const Layout: ILayout = observer(() => {
	const {
		store: {
			employeesStore: { makeRequest },
		},
	} = useContext(GlobalContext);

	return (
		<div className="d-flex justify-content-center">
			<div className="info-header d-block">
				<h1 className="text-center">Welcome to my application.</h1>
				<h4 className="text-center">
					This application is developed with React in the frontend and
					.NET on the backend which are totally separate.
				</h4>
				<h5 className="text-center">
					I kept it as simple as possible in order to not waste any
					time on making it pretty. We can discuss what can be done
					better if there was time to spare.
				</h5>
				<hr className="m-5" />
				<div className="d-flex align-items-center justify-content-center">
					<Button className="btn-success" onClick={makeRequest}>
						Upload CSV
					</Button>
				</div>
				<Employees />
				<LongestMatch />
			</div>
		</div>
	);
});
