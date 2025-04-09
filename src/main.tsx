import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthRequired } from "./components/AuthRequired";
import App from "./App.tsx";
import ChatPage from "./ChatPage.tsx";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HealthTipsPage from "./pages/HealthTipsPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ThemeProvider>
					<Routes>
						<Route
							path="/"
							element={<App />}
						/>
						<Route
							path="/login"
							element={<LoginPage />}
						/>
						<Route
							path="/signup"
							element={<SignupPage />}
						/>
						<Route
							path="/health-tips"
							element={<HealthTipsPage />}
						/>
						<Route
							path="/chat"
							element={
								<AuthRequired>
									<ChatPage />
								</AuthRequired>
							}
						/>
					</Routes>
				</ThemeProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
