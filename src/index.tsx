import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { AuthProvider } from "./hooks/auth";

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
