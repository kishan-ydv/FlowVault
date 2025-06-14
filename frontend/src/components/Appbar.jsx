

import { useNavigate } from 'react-router-dom';

export const Appbar = ({user}) => {
    const navigate = useNavigate();

    const handleSignout = () => {
        if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('token');
        navigate('/signin');
    }
    };

     const getUserInitial = () => {
    if (user && user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return 'U'; 
  };

    return (
        <div className="shadow h-14 flex justify-between items-center px-4">
            <div className="flex items-center">
                <div className="text-xl font-bold text-gray-800 tracking-tight">
                    FlowVault
                </div>
            </div>

  
            <div className="flex items-center space-x-4">
              
                <div className="flex items-center space-x-2">
                    <div className="font-semibold ml-1 text-sm">
                        Hello,<span>
                            {user ? user.firstName : 'User'}    
                        </span>
                    </div>
                    <div className="rounded-full h-8 w-8 bg-slate-200 flex justify-center items-center">
                        <div className="text-sm font-medium">
                            {getUserInitial()}
                        </div>
                    </div>
                </div>

                
                <button
                    onClick={handleSignout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
};