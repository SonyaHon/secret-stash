import React from "react";
import { observer } from "mobx-react";
import { BrowserRouter } from "react-router-dom";

import "./app.scss";
import { Router } from "./router";
import { AppNavbar } from "./app-navbar";

export const App: React.FC = observer(() => {
	return (
		<BrowserRouter>
			<div className="app">
				<AppNavbar />
				<Router />
			</div>
		</BrowserRouter>
	);
});
