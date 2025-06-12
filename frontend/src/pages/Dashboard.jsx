

import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { CardSkeleton, UserListSkeleton } from "../components/Loading";

export const Dashboard = ()=> {
    const [balance, setBalance] = useState(0);
    const[user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
    const [users, setUsers] = useState([]);
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [balanceError, setBalanceError] = useState("");
    const [usersError, setUsersError] = useState("");

    useEffect(() => {
        fetchBalance();
        fetchUsers();
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/user/me", {
                headers: {  
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const userData = response.data.user;
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };

    const fetchBalance = async () => {
        setIsLoadingBalance(true);
        setBalanceError("");
        
        try {
            const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const balance = response.data.balance;
            setBalance(balance.toFixed(2)); 
        } catch (error) {
            console.error("Failed to fetch balance:", error);
            setBalanceError("Failed to load balance");
        } finally {
            setIsLoadingBalance(false);
        }
    };

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        setUsersError("");
        
        try {
            const response = await axios.get("http://localhost:3000/api/v1/user/bulk", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setUsers(response.data.user);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setUsersError("Failed to load users");
        } finally {
            setIsLoadingUsers(false);
        }
    };

     const getUserInitial = () => {
    if (user && user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return 'U'; // fallback
  };

    return (
        <div>
            <Appbar user={user}/>
            <div className="m-8">
                <div className="mb-8 flex justify-between items-start">
                   <div className="flex-1">
                     {isLoadingBalance ? (
                        <div className="mb-4">
                            <h1 className="text-4xl font-bold mb-2">Your balance</h1>
                            <CardSkeleton />
                        </div>
                    ) : balanceError ? (
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Your balance</h1>
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {balanceError}
                                <button 
                                    onClick={fetchBalance}
                                    className="ml-2 underline hover:no-underline"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Balance value={balance} />
                    )}
                   </div>

                    {/*Transaction History section*/}
                    <div className="ml-8">
                        <Link 
                            to="/transactions" 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            View Transaction History
                        </Link>
                    </div>
                </div>

                {/* Users Section */}
                <div>
                    {isLoadingUsers ? (
                        <div>
                            <h1 className="font-bold mt-6 text-lg mb-4">Users</h1>
                            <UserListSkeleton />
                        </div>
                    ) : usersError ? (
                        <div>
                            <h1 className="font-bold mt-6 text-lg mb-4">Users</h1>
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {usersError}
                                <button 
                                    onClick={fetchUsers}
                                    className="ml-2 underline hover:no-underline"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Users users={users} />
                    )}
                </div>
            </div>
        </div>
    );
}