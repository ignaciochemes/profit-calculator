import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import DashBoardContainer from "./Pages/Dashboard/Containers/DashBoardContainer";
import NotFoundPage from "./Pages/NotFound/NotFoundPage";
import AddProductContainer from "./Pages/AddProduct/AddProductContainer";
import ProductContainer from "./Pages/Products/ProductContainer";
import ProfitContainer from "./Pages/Profit/ProfitContainer";
import LoginContainer from "./Pages/Auth/LoginContainer";
import RegisterContainer from "./Pages/Auth/RegisterContainer";
import CalculatorContainer from "./Pages/Calculator/Containers/CalculatorContainer";

function Router() {
    useEffect(() => {
        const verifyToken = async () => {
            const token = sessionStorage.getItem('refreshToken');
            if (token) {
                try {
                    const response = await fetch('http://localhost:33000/api/v1/carta-online/auth/token/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.result.verify !== true) {
                            window.location.href = '/login';
                        }
                    } else {
                        console.error('Error en la verificación del token');
                        window.location.href = '/login';
                    }
                } catch (error) {
                    console.error('Error al verificar el token:', error);
                    window.location.href = '/login';
                }
            }
        };
        verifyToken();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<DashBoardContainer />} />
            <Route path="/calculator" element={<CalculatorContainer />} />
            <Route path="/products" element={<ProductContainer />} />
            <Route path="/addproduct" element={<AddProductContainer />} />
            <Route path="/profit" element={<ProfitContainer />} />
            <Route path="/signin" element={<LoginContainer />} />
            <Route path="/signup" element={<RegisterContainer />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default Router;