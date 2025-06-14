import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useState } from "react"
import axios from "axios";  
import { useNavigate } from "react-router-dom"

export const Signin = () => {
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();
      
    return <div className="bg-gradient-to-br from-slate-100 to-slate-300 h-screen flex flex-col justify-between items-center">
      <div className="bg-white/90 backdrop-blur-sm shadow h-14 flex justify-between items-center px-4 w-full border-b border-gray-100">
        <div className="flex items-center">
            <div className="text-xl font-bold text-gray-800 tracking-tight">
                FlowVault
            </div>
        </div>
    </div>
     <div className="flex flex-col mb-14 py-2 justify-center">
       <div className="rounded-xl bg-white w-96 text-center px-8 py-2 h-max shadow-xl border border-gray-100">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={e => {
          setUsername(e.target.value);
        } }placeholder="kishan@gmail.com" label={"Email"} />
        <InputBox onChange={e => {
          setPassword(e.target.value);
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async()=>{
            const response = await axios.post("https://flowvault.onrender.com/api/v1/user/signin", {
              username,
              password
            });
            localStorage.setItem("token", response.data.token)
            navigate("/dashboard")
          }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}
