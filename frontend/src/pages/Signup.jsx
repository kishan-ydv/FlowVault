import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { LoadingButton } from "../components/Loading"
import axios from "axios";
import { useNavigate } from "react-router-dom"

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

      const handleSignup = async () => {
        setIsLoading(true);
        setError("");
        
        try {
            const response = await axios.post("https://flowvault.onrender.com/api/v1/user/signup", {
                username,
                firstName,
                lastName,
                password
            });
            
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup failed:", error);
            setError(
                error.response?.data?.message || 
                "Signup failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex flex-col justify-between items-center">
    <div className="shadow h-14 flex justify-between items-center px-4 w-full">
        <div className="flex items-center">
            <div className="text-xl font-bold">
                FlowVault
            </div>
        </div>
    </div>
    
    <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign up"} />
            <SubHeading label={"Enter your information to create an account"} />
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <InputBox 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="John" 
                label={"First Name"} 
                disabled={isLoading}
            />
            <InputBox 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="Doe" 
                label={"Last Name"} 
                disabled={isLoading}
            />
            <InputBox 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="john@gmail.com" 
                label={"Email"} 
                disabled={isLoading}
            />
            <InputBox 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="123456" 
                label={"Password"} 
                type="password"
                disabled={isLoading}
            />
            
            <div className="pt-4">
                <LoadingButton
                    isLoading={isLoading}
                    onClick={handleSignup}
                    className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-gray-900 text-white hover:bg-gray-900/90"
                >
                    Sign up
                </LoadingButton>
            </div>
            
            <BottomWarning 
                label={"Already have an account?"} 
                buttonText={"Sign in"} 
                to={"/signin"} 
            />
        </div>
    </div>
    
    <div></div> 
</div>
    );
}
