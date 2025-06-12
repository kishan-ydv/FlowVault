export const InputBox = ({ label, placeholder, onChange, type = "text", disabled = false }) => {
    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
                {label}
            </div>
            <input 
                onChange={onChange} 
                placeholder={placeholder} 
                type={type}
                disabled={disabled}
                className={`w-full px-2 py-1 border rounded border-slate-200 ${
                    disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                }`}
            />
        </div>
    );
}