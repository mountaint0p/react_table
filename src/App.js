import React from "react";
import "./App.css";
import { MainTable } from "./components/MainTable";
import { DatabaseTable } from "./components/DatabaseTable";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
	return (
		<div
			style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
		>
			<BrowserRouter>
				<div className="App" style={{ width: "90%" }}>
					<Routes>
						<Route path="/" element={<DatabaseTable />} />
						<Route path="/table/:id" element={<MainTable />} />
					</Routes>
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
