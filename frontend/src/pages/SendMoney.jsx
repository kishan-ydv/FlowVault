

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingButton, Spinner } from "../components/Loading";

export const SendMoney= ()=> {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleTransfer = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        setIsLoading(true);
        setError("");
        
        try {
            const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount: parseInt(amount)
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setSuccess(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
            
        } catch (error) {
            console.error("Transfer failed:", error);
            setError(
                error.response?.data?.message || 
                "Transfer failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex justify-center h-screen bg-gray-100">
                <div className="h-full flex flex-col justify-center">
                    <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                        <div className="text-center">
                            <div className="text-green-600 text-6xl mb-4">✓</div>
                            <h2 className="text-3xl font-bold text-green-600">Transfer Successful!</h2>
                            <p className="text-gray-600 mt-2">
                                ₹{amount} sent to {name} successfully
                            </p>
                            <div className="flex items-center justify-center mt-4">
                                <Spinner size="sm" />
                                <span className="ml-2 text-sm text-gray-500">Redirecting to dashboard...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">
                                    {name ? name[0].toUpperCase() : "?"}
                                </span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name || "Unknown User"}</h3>
                        </div>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="amount">
                                    Amount (in Rs)
                                </label>
                                <input
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <LoadingButton
                                isLoading={isLoading}
                                onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-500/90"
                            >
                                Initiate Transfer
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}