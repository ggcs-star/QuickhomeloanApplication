import { Lightbulb } from "lucide-react";

export default function ProTip() {
  const tips = [
    "Choose the shortest affordable tenure to save interest.",
    "Make partial prepayments whenever possible.",
    "Maintain a good credit score.",
    "Compare at least 2–3 lenders.",
    "Read loan agreements carefully.",
  ];

  return (
    <div className="mt-6">

      <div className="
        bg-[#1f2a3c] 
        rounded-3xl 
        p-5 
        text-white
        shadow-[0_8px_20px_rgba(0,0,0,0.2)]
      ">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={20} className="text-blue-400" />
          <h3 className="text-lg font-semibold">
            Pro Tip
          </h3>
        </div>

        {/* LIST */}
        <ul className="space-y-4">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">

              {/* CHECK ICON */}
              <span className="text-blue-400 mt-1 text-sm">
                ✓
              </span>

              {/* TEXT */}
              <span className="text-sm text-gray-200 leading-relaxed">
                {tip}
              </span>

            </li>
          ))}
        </ul>

      </div>

    </div>
  );
}