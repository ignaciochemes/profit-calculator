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