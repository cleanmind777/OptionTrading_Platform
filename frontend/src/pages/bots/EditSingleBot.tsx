import { useState } from "react";

export function EditSingleBot() {
  const [selectedBot, setSelectedBot] = useState("");

  // Mock bot data for the dropdown
  const availableBots = [
    "Autotrader Bot #1",
    "Autotrader Bot #2",
    "Autotrader Bot #3",
    "Momentum Bot",
    "Scalping Bot",
    "Swing Trading Bot",
  ];

  const handleButtonClick = (action: string) => {
    if (!selectedBot) {
      console.log(
        "Please select a bot from the dropdown before performing this action."
      );
      return;
    }

    // Handle different actions
    switch (action) {
      case "edit":
        console.log(`Opening edit interface for ${selectedBot}`);
        break;
      case "create":
        console.log("Redirecting to bot creation wizard...");
        break;
      case "copy":
        console.log(
          `Created a copy of ${selectedBot} as "${selectedBot} - Copy"`
        );
        break;
      case "tranches":
        console.log(`Setting up tranches for ${selectedBot}`);
        break;
      case "history":
        console.log(`Loading configuration history for ${selectedBot}`);
        break;
      case "activity":
        console.log(`Displaying recent activity for ${selectedBot}`);
        break;
      case "share":
        console.log(
          `Share link for ${selectedBot} has been copied to clipboard`
        );
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Edit Autotrader Bot
          </h1>
        </div>

        {/* Bot Selection and Actions */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <label className="text-white font-medium">
                Select Bot to Edit
              </label>
              <div className="relative">
                <select
                  value={selectedBot}
                  onChange={(e) => setSelectedBot(e.target.value)}
                  className="bg-slate-700 text-white rounded px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Bot to Edit</option>
                  {availableBots.map((bot) => (
                    <option key={bot} value={bot}>
                      {bot}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleButtonClick("edit")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                EDIT BOT
              </button>
              <button
                onClick={() => handleButtonClick("create")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                CREATE NEW
              </button>
              <button
                onClick={() => handleButtonClick("copy")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                COPY TO NEW BOT
              </button>
              <button
                onClick={() => handleButtonClick("tranches")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                CREATE TRANCHES
              </button>
              <button
                onClick={() => handleButtonClick("history")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                SETTINGS HISTORY
              </button>
              <button
                onClick={() => handleButtonClick("activity")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                BOT ACTIVITY
              </button>
              <button
                onClick={() => handleButtonClick("share")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                SHARE BOT
              </button>
            </div>
          </div>

          {/* Bot Configuration Interface */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Bot Configuration</h2>
            <div className="text-gray-400">
              <p>Bot configuration interface would appear here...</p>
              <p className="mt-2">
                This would include strategy settings, risk parameters, and
                trading rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
