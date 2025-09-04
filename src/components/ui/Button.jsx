export default function Button({ children, onClick, className = "" }) {
	return (
		<button
			onClick={onClick}
			className={`px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm ${className}`}
		>
			{children}
		</button>
	);
}
