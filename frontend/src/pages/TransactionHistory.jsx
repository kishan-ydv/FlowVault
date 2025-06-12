import React, {useState, useEffect} from 'react';
import axios from 'axios';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/v1/transactions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(response.data.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    //Search Transactions
    const searchTransactions = async(query) => {
        if(!query.trim()) {
            fetchTransactions();
            return;
        }
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/v1/transactions/search?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setTransactions(response.data.data);
        } catch (error) {
            console.log('Error searching transactions:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    },[]);

    //Handled search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchTransactions(searchQuery);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
         <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
            
            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by first name or last name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-4">
                    <div className="text-gray-500">Loading transactions...</div>
                </div>
            )}

            {/* Transaction List */}
            {!loading && transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No transactions found for your search.' : 'No transactions yet.'}
                </div>
            ) : (
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="bg-white p-4 rounded-lg shadow border"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium">
                                        {transaction.type === 'debit' ? 'Sent to' : 'Received from'} {transaction.counterparty}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        ID: {transaction.transactionId}
                                    </div>
                                </div>
                                <div className='flex flex-col items-end space-y-1'>
                                    <div className={`text-lg font-semibold ${
                                        transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {transaction.type === 'debit' ? '-' : '+'}₹{transaction.amount}
                                    </div>
                                    <div className='text-sm font-medium text-gray-500'>
                                        Bal: ₹{Number(transaction.balanceAfterTransaction).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;