import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import GithubConfirm from "./routes/GithubConfirm";
import KakaoConfirm from "./routes/KaKaoConfirm";
import RegisterStock from "./routes/RegisterStock";
import RegisterStockTransaction from "./routes/RegisterStockTransaction";
import CategoryStocks from "./routes/CategoryStocks";
import RegisterCategory from "./routes/RegisterCategory";
import RegisterComplete from "./routes/RegisterComplete";
import ModifyStockTrans from "./routes/ModifyStockTrans";
import BankDashBoard from "./routes/CategoryBanks";
import RegisterBank from "./routes/RegisterBank";
import ModifyBankTrnas from "./routes/ModifyBankTrans";
import RegisterBankTransaction from "./routes/RegisterBankTransaction";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                path: "",
                element : <Home />,
            },
            {
                path: "social",
                children : [
                    {
                        path: "github",
                        element: <GithubConfirm />,
                    },
                    {
                        path: "kakao",
                        element: <KakaoConfirm />,
                    }
                ]
            },
            {
                path: "register",
                children : [
                    {
                        path: 'category/stock',
                        element: <RegisterCategory />
                    },
                    {
                        path: 'category/bank',
                        element: <RegisterBank />
                    },
                    {
                        path: 'complete',
                        element: <RegisterComplete />,
                    },
                    {
                        path: "stock_transaction/:categoryPk/:stockPk",
                        element: <RegisterStockTransaction />,
                    },
                    {
                        path: "bank_transaction/:categoryPk",
                        element: <RegisterBankTransaction />,
                    },
                    {
                        path: "modify/stock_transaction/:transPk",
                        element: <ModifyStockTrans />,
                    },
                    {
                        path: "modify/bank_transaction/:transPk",
                        element: <ModifyBankTrnas />
                    }
                ]
            },
            {
                path: "read",
                children: [
                    {
                        path: "categorystocks/:categoryPk",
                        element: <CategoryStocks />,
                    },
                    {
                        path: "categoryStocks/:categoryPk/register",
                        element: <RegisterStock />
                    },
                    {
                        path: "categoryBanks",
                        element: <BankDashBoard />
                    },
                ]
            }
        ]
    }
]);

export default router;