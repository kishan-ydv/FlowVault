import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import AuthRedirect from "./pages/AuthRedirect";
import TransactionHistory from "./pages/TransactionHistory";

function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRedirect />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App