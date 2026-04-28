export default function Stat({ label, value }) {
  return (
    <div className="flex justify-between bg-white p-3 rounded-lg shadow-sm">
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}