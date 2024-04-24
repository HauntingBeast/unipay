export function InputBox({ label, placeholder, onChange, type = "text" }) {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
      </div>
      <input
        onChange={onChange}
        type={type} // Conditionally set input type based on the 'type' prop
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded border-slate-200"
      />
    </div>
  );
}
