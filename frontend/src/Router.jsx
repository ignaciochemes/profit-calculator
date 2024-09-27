import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashBoardContainer from "./Pages/Dashboard/Containers/DashBoardContainer";
import NotFoundPage from "./Pages/NotFound/NotFoundPage";
import AddProductContainer from "./Pages/AddProduct/AddProductContainer";
import ProductContainer from "./Pages/Products/ProductContainer";
import ProfitContainer from "./Pages/Profit/ProfitContainer";
import LoginContainer from "./Pages/Auth/LoginContainer";
import RegisterContainer from "./Pages/Auth/RegisterContainer";
import CalculatorContainer from "./Pages/Calculator/Containers/CalculatorContainer";
import { Spinner } from "react-bootstrap";

function Router() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            setIsLoading(true);
            const token = sessionStorage.getItem('refreshToken');
            if (token) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/token/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setIsAuthenticated(data.result.verify === true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Error al verificar el token:', error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };
        verifyToken();
    }, []);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Routes>
            {isAuthenticated ? (
                <>
                    <Route path="/" element={<DashBoardContainer />} />
                    <Route path="/calculator" element={<CalculatorContainer />} />
                    <Route path="/products" element={<ProductContainer />} />
                    <Route path="/addproduct" element={<AddProductContainer />} />
                    <Route path="/profit" element={<ProfitContainer />} />
                    <Route path="*" element={<NotFoundPage />} />
                </>
            ) : (
                <>
                    <Route path="/signin" element={<LoginContainer />} />
                    <Route path="/signup" element={<RegisterContainer />} />
                    <Route path="*" element={<Navigate to="/signin" replace />} />
                </>
            )}
        </Routes>
    );
}

export default Router;