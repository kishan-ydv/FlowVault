
export const Spinner = ({ size = 'md', color = 'blue' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const colorClasses = {
        blue: 'border-blue-600',
        white: 'border-white',
        gray: 'border-gray-600'
    };

    return (
        <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    );
};


export const LoadingButton = ({ isLoading, children, onClick, className = '', ...props }) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {isLoading && <Spinner size="sm" color="white" />}
            {children}
        </button>
    );
};


export const PageLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen bg-slate-300 flex justify-center items-center">
            <div className="text-center">
                <Spinner size="lg" />
                <p className="text-gray-600 mt-4">{message}</p>
            </div>
        </div>
    );
};


export const CardSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2"></div>
        </div>
    );
};


export const UserListSkeleton = ({ count = 5 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded animate-pulse">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-300 h-10 w-10 rounded-full"></div>
                        <div>
                            <div className="bg-gray-300 h-4 w-24 rounded mb-2"></div>
                            <div className="bg-gray-300 h-3 w-32 rounded"></div>
                        </div>
                    </div>
                    <div className="bg-gray-300 h-8 w-20 rounded"></div>
                </div>
            ))}
        </div>
    );
};