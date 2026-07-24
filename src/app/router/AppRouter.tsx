import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/Login/LoginPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}