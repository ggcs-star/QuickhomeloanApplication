export default function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border rounded-lg px-4 py-3 text-lg font-semibold"
      />
    </div>
  );
}