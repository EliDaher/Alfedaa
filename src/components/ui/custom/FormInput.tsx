import { Input } from "../input";

export default function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div className="text-right">
      <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input
        name={id}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`text-right border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
