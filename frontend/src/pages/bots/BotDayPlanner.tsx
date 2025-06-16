import { useState } from "react";

type DayOfWeek = "ALL DAYS" | "MON" | "TUE" | "WED" | "THU" | "FRI";

export function BotDayPlanner() {
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(["ALL DAYS"]);

  const days: DayOfWeek[] = ["ALL DAYS", "MON", "TUE", "WED", "THU", "FRI"];

  const handleDayToggle = (day: DayOfWeek) => {
    if (day === "ALL DAYS") {
      setSelectedDays(["ALL DAYS"]);
    } else {
      // Remove 'ALL DAYS' if selecting individual days
      const newSelectedDays = selectedDays.filter((d) => d !== "ALL DAYS");

      if (selectedDays.includes(day)) {
        // Remove the day if already selected
        const updatedDays = newSelectedDays.filter((d) => d !== day);
        setSelectedDays(updatedDays.length === 0 ? ["ALL DAYS"] : updatedDays);
      } else {
        // Add the day
        const updatedDays = [...newSelectedDays, day];
        setSelectedDays(updatedDays);
      }
    }
  };

  const handleUpdatePlanner = () => {
    // Update planner logic would go here
    console.log("Update planner for days:", selectedDays);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bot Day Planner
          </h1>
        </div>

        {/* Select Entry Days Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
          <h2 className="text-lg font-medium text-white mb-4">
            Select Entry Days
          </h2>

          <div className="flex flex-wrap gap-3 justify-center">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-6 py-2 rounded-md border font-medium transition-colors ${
                  selectedDays.includes(day)
                    ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    : "bg-transparent border-slate-600 text-gray-300 hover:bg-slate-700 hover:border-slate-500"
                }`}
              >
                {day}
              </button>
            ))}

            <button
              onClick={handleUpdatePlanner}
              className="ml-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              UPDATE PLANNER
            </button>
          </div>
        </div>

        {/* Empty State Message */}
        <div className="text-center text-gray-400 max-w-2xl mx-auto">
          <h3 className="text-xl font-medium mb-4">
            No bots scheduled for the selected day(s)
          </h3>
          <p className="text-gray-500">
            Try selecting different days or check if you have any enabled bots
            with entry time windows.
          </p>
        </div>
      </div>
    </div>
  );
}
