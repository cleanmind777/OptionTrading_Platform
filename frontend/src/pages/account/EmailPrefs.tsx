import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EmailPreference {
  enabled: boolean;
  description: string;
  toggleDescription: string;
}

export function EmailPrefs() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<
    Record<string, EmailPreference>
  >({
    botTrading: {
      enabled: true,
      description:
        "Alerts from bots relating to executing trades in your brokerage accounts",
      toggleDescription:
        "Receive emails about issues with your bots that impact your trading",
    },
    serviceAlerts: {
      enabled: true,
      description:
        "Alerts about the service, connectivity with your broker, and issues that may require immediate attention to your account",
      toggleDescription:
        "Receive updates about new features, platform improvements, and enhancements",
    },
    featureAnnouncements: {
      enabled: true,
      description:
        "Emails announcing new features, improvements, and enhancements",
      toggleDescription:
        "Receive updates about new features, platform improvements, and enhancements",
    },
    promotionalEmails: {
      enabled: false,
      description:
        "Special offers, discounts, and other marketing communications from tradeSteward",
      toggleDescription:
        "Receive promotional offers, discounts, and marketing communications",
    },
  });

  const togglePreference = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Page Header */}
      <div className="bg-[rgb(15 23 42)] py-4">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-white text-center">
            Email Preferences
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-gray-300 mb-8">
          Manage your email notification preferences below. You can enable or
          disable different types of emails from tradeSteward.
        </p>

        {/* Email Preference Settings */}
        <div className="space-y-6 mb-8">
          {/* Bot Trading Alerts */}
          <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Bot Trading Alerts
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {preferences.botTrading.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    Setting status:{" "}
                    {preferences.botTrading.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {preferences.botTrading.toggleDescription}
                </p>
              </div>
              <button
                onClick={() => togglePreference("botTrading")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  preferences.botTrading.enabled
                    ? "bg-blue-600"
                    : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.botTrading.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Service Alerts */}
          <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Service Alerts
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {preferences.serviceAlerts.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    Setting status:{" "}
                    {preferences.serviceAlerts.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {preferences.serviceAlerts.toggleDescription}
                </p>
              </div>
              <button
                onClick={() => togglePreference("serviceAlerts")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  preferences.serviceAlerts.enabled
                    ? "bg-blue-600"
                    : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.serviceAlerts.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Feature Announcements */}
          <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Feature Announcements
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {preferences.featureAnnouncements.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    Setting status:{" "}
                    {preferences.featureAnnouncements.enabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {preferences.featureAnnouncements.toggleDescription}
                </p>
              </div>
              <button
                onClick={() => togglePreference("featureAnnouncements")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  preferences.featureAnnouncements.enabled
                    ? "bg-blue-600"
                    : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.featureAnnouncements.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Promotional Emails */}
          <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Promotional Emails
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {preferences.promotionalEmails.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    Setting status:{" "}
                    {preferences.promotionalEmails.enabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {preferences.promotionalEmails.toggleDescription}
                </p>
              </div>
              <button
                onClick={() => togglePreference("promotionalEmails")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  preferences.promotionalEmails.enabled
                    ? "bg-blue-600"
                    : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.promotionalEmails.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => {
              // Handle saving preferences
              navigate("/account-settings");
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            UPDATE EMAIL PREFERENCES
          </button>
          <button
            onClick={() => navigate("/account-settings")}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm"
          >
            BACK TO ACCOUNT SETTINGS
          </button>
        </div>

        {/* Important Information */}
        <div className="bg-[rgb(15 23 42)] rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Important Information
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Note: Some critical service notifications may still be sent even if
            you disable certain email types, particularly those related to
            account security or urgent trading issues that require immediate
            attention.
          </p>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">
              What each email type includes:
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>
                  <strong>Bot Trading Alerts:</strong> Issues with your bots
                  that impact your trading
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>
                  <strong>Service Alerts:</strong> System outage notices,
                  upcoming maintenance notices and global broker connectivity
                  issues
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>
                  <strong>Feature Announcements:</strong> New platform features,
                  improvements, and enhancements
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>
                  <strong>Promotional Emails:</strong> Special offers,
                  subscription deals, and other marketing communications from
                  tradeSteward
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
