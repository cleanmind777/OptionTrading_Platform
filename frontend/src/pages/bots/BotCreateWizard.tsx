import { useState, useEffect } from "react";

interface ValidationError {
  field: string;
  message: string;
  type: "error" | "warning" | "info";
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completionPercentage: number;
}

interface BotConfig {
  // Bot Identification
  botName: string;
  tradingAccount: string;
  strategyAssignment: string;
  botStatus: string;

  // Trading Strategy
  underlyingSymbol: string;
  tradeType: string;
  numberOfLegs: string;
  skipAMExpirations: boolean;
  sellBidlessLongs: boolean;
  efficientSpreads: boolean;

  // Position Legs
  legs: Array<{
    targetType: string;
    strikeTarget: number;
    optionType: string;
    longOrShort: string;
    sizeRatio: number;
    daysToExpiration: string;
    conflictResolution: string;
  }>;

  // Trade Entry
  enterBy: string;
  positionSizing: string;
  quantity: number;
  includeCredit: boolean;
  autoSizeDown: boolean;
  entryTimeWindow: {
    start: string;
    end: string;
  };
  daysOfWeekToEnter: string[];
  openIfNoPosition: boolean;
  entrySpeed: string;
  entryTimeRandomization: string;
  sequentialEntryDelay: string;

  // Trade Exit
  timedExit: boolean;
  profitTargetType: string;
  disableProfitTargetAfterStop: boolean;

  // Trade Stop
  stopLossType: string;
  trailingStops: boolean;

  // Trade Conditions
  entryFilters: {
    maxTradesPerDay: number;
    isMaxTradesPerDayEnabled: boolean;
    maxConcurrentTrades: number;
    isMaxConcurrentTradesEnabled: boolean;
    minimumPriceToEnter: number;
    isMinimumPriceToEnterEnabled: boolean;
    maximumPriceToEnter: number;
    isMaximumPriceToEnterEnabled: boolean;
    checkClosingsBeforeOpening: boolean;
    isEntryFiltersEnabled: boolean;
    isCheckClosingsEnabled: boolean;
    isAnyEnabled: boolean;
    isCreditEnabled: boolean;
    isDebitEnabled: boolean;
    onlyCreditOrDebit: string;
    isFirstFridayEnabled: boolean;
    isSkipEventDaysEnabled: boolean;
    isTimeEnabled: boolean;
    isFirstTickerEnabled: boolean;
    isToExpirationEnabled: boolean;
    isInTradeEnabled: boolean;
  };
  openingQuote: boolean;
  skipEventDays: boolean;

  // Bot Dependencies
  enableBotDependencies: boolean;

  // Bot Notes
  notes: string;

  // Webhook
  webhookEnabled: boolean;
}

export function BotCreateWizard() {
  const [config, setConfig] = useState<BotConfig>({
    // Bot Identification
    botName: "",
    tradingAccount: "",
    strategyAssignment: "",
    botStatus: "ENABLED",

    // Trading Strategy
    underlyingSymbol: "",
    tradeType: "",
    numberOfLegs: "One",
    skipAMExpirations: false,
    sellBidlessLongs: false,
    efficientSpreads: false,

    // Position Legs
    legs: [
      {
        targetType: "Target Type",
        strikeTarget: 0,
        optionType: "PUT",
        longOrShort: "LONG",
        sizeRatio: 1,
        daysToExpiration: "Exact",
        conflictResolution: "",
      },
    ],

    // Trade Entry
    enterBy: "",
    positionSizing: "QUANTITY",
    quantity: 1,
    includeCredit: false,
    autoSizeDown: false,
    entryTimeWindow: {
      start: "16",
      end: "00",
    },
    daysOfWeekToEnter: ["ALL"],
    openIfNoPosition: false,
    entrySpeed: "URGENT",
    entryTimeRandomization: "No Randomization",
    sequentialEntryDelay: "0s",

    // Trade Exit
    timedExit: false,
    profitTargetType: "DISABLED",
    disableProfitTargetAfterStop: false,

    // Trade Stop
    stopLossType: "DISABLED",
    trailingStops: false,

    // Trade Conditions
    entryFilters: {
      maxTradesPerDay: 1,
      isMaxTradesPerDayEnabled: false,
      maxConcurrentTrades: 1,
      isMaxConcurrentTradesEnabled: false,
      minimumPriceToEnter: 0,
      isMinimumPriceToEnterEnabled: false,
      maximumPriceToEnter: 0,
      isMaximumPriceToEnterEnabled: false,
      checkClosingsBeforeOpening: false,
      isEntryFiltersEnabled: false,
      isCheckClosingsEnabled: false,
      isAnyEnabled: false,
      isCreditEnabled: false,
      isDebitEnabled: false,
      onlyCreditOrDebit: "",
      isFirstFridayEnabled: false,
      isSkipEventDaysEnabled: false,
      isTimeEnabled: false,
      isFirstTickerEnabled: false,
      isToExpirationEnabled: false,
      isInTradeEnabled: false,
    },
    openingQuote: false,
    skipEventDays: false,

    // Bot Dependencies
    enableBotDependencies: false,

    // Bot Notes
    notes: "",

    // Webhook
    webhookEnabled: false,
  });

  // Validation state
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
    completionPercentage: 0,
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [fieldWarnings, setFieldWarnings] = useState<{ [key: string]: string }>(
    {}
  );
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Validation rules
  const validateField = (
    field: string,
    value: any,
    config: BotConfig
  ): ValidationError[] => {
    const errors: ValidationError[] = [];

    switch (field) {
      case "botName":
        if (!value || value.trim().length === 0) {
          errors.push({
            field,
            message: "Bot name is required",
            type: "error",
          });
        } else if (value.trim().length < 3) {
          errors.push({
            field,
            message: "Bot name must be at least 3 characters",
            type: "error",
          });
        } else if (value.trim().length > 50) {
          errors.push({
            field,
            message: "Bot name cannot exceed 50 characters",
            type: "error",
          });
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
          errors.push({
            field,
            message:
              "Bot name can only contain letters, numbers, spaces, hyphens, and underscores",
            type: "error",
          });
        }
        break;

      case "tradingAccount":
        if (!value) {
          errors.push({
            field,
            message: "Trading account selection is required",
            type: "error",
          });
        }
        break;

      case "strategyAssignment":
        if (!value) {
          errors.push({
            field,
            message: "Strategy assignment is required",
            type: "error",
          });
        }
        break;

      case "underlyingSymbol":
        if (!value) {
          errors.push({
            field,
            message: "Underlying symbol is required",
            type: "error",
          });
        } else if (!/^[A-Z]{1,5}$/.test(value)) {
          errors.push({
            field,
            message: "Symbol must be 1-5 uppercase letters",
            type: "error",
          });
        }
        break;

      case "tradeType":
        if (!value) {
          errors.push({
            field,
            message: "Trade type selection is required",
            type: "error",
          });
        }
        break;

      case "quantity":
        if (!value || value <= 0) {
          errors.push({
            field,
            message: "Quantity must be greater than 0",
            type: "error",
          });
        } else if (value > 1000) {
          errors.push({
            field,
            message: "Quantity cannot exceed 1000 for safety",
            type: "warning",
          });
        } else if (value > 100) {
          errors.push({
            field,
            message: "Large quantities may impact liquidity",
            type: "warning",
          });
        }
        break;

      case "maxTradesPerDay":
        if (!value || value <= 0) {
          errors.push({
            field,
            message: "Must allow at least 1 trade per day",
            type: "error",
          });
        } else if (value > 20) {
          errors.push({
            field,
            message: "More than 20 trades per day is not recommended",
            type: "warning",
          });
        } else if (value > 10) {
          errors.push({
            field,
            message: "High frequency trading increases risk",
            type: "info",
          });
        }
        break;

      case "maxConcurrentTrades":
        if (!value || value <= 0) {
          errors.push({
            field,
            message: "Must allow at least 1 concurrent trade",
            type: "error",
          });
        } else if (value > 10) {
          errors.push({
            field,
            message: "Too many concurrent trades increases risk",
            type: "warning",
          });
        }
        break;

      case "minimumPriceToEnter":
        if (value < 0) {
          errors.push({
            field,
            message: "Minimum price cannot be negative",
            type: "error",
          });
        } else if (
          value > config.entryFilters.maximumPriceToEnter &&
          config.entryFilters.maximumPriceToEnter > 0
        ) {
          errors.push({
            field,
            message: "Minimum price cannot exceed maximum price",
            type: "error",
          });
        }
        break;

      case "maximumPriceToEnter":
        if (value < 0) {
          errors.push({
            field,
            message: "Maximum price cannot be negative",
            type: "error",
          });
        } else if (
          value < config.entryFilters.minimumPriceToEnter &&
          value > 0
        ) {
          errors.push({
            field,
            message: "Maximum price cannot be less than minimum price",
            type: "error",
          });
        } else if (value > 10000) {
          errors.push({
            field,
            message: "Very high price limits may not be practical",
            type: "warning",
          });
        }
        break;

      case "strikeTarget":
        if (value < 0) {
          errors.push({
            field,
            message: "Strike target cannot be negative",
            type: "error",
          });
        }
        break;

      case "sizeRatio":
        if (!value || value <= 0) {
          errors.push({
            field,
            message: "Size ratio must be greater than 0",
            type: "error",
          });
        } else if (value > 10) {
          errors.push({
            field,
            message: "Large size ratios may impact execution",
            type: "warning",
          });
        }
        break;
    }

    return errors;
  };

  // Comprehensive form validation
  const validateForm = (config: BotConfig): ValidationResult => {
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];

    // Required fields validation
    const requiredFields = [
      "botName",
      "tradingAccount",
      "strategyAssignment",
      "underlyingSymbol",
      "tradeType",
      "quantity",
    ];

    requiredFields.forEach((field) => {
      const fieldValue = field.includes(".")
        ? field.split(".").reduce((obj, key) => obj?.[key], config as any)
        : (config as any)[field];

      const errors = validateField(field, fieldValue, config);
      errors.forEach((error) => {
        if (error.type === "error") {
          allErrors.push(error);
        } else if (error.type === "warning") {
          allWarnings.push(error);
        }
      });
    });

    // Validate nested fields
    const nestedValidations = [
      {
        field: "entryFilters.maxTradesPerDay",
        value: config.entryFilters.maxTradesPerDay,
      },
      {
        field: "entryFilters.maxConcurrentTrades",
        value: config.entryFilters.maxConcurrentTrades,
      },
      {
        field: "entryFilters.minimumPriceToEnter",
        value: config.entryFilters.minimumPriceToEnter,
      },
      {
        field: "entryFilters.maximumPriceToEnter",
        value: config.entryFilters.maximumPriceToEnter,
      },
    ];

    nestedValidations.forEach(({ field, value }) => {
      const fieldName = field.split(".").pop() || field;
      const errors = validateField(fieldName, value, config);
      errors.forEach((error) => {
        if (error.type === "error") {
          allErrors.push({ ...error, field });
        } else if (error.type === "warning") {
          allWarnings.push({ ...error, field });
        }
      });
    });

    // Validate legs
    config.legs.forEach((leg, index) => {
      const legErrors = [
        ...validateField("strikeTarget", leg.strikeTarget, config),
        ...validateField("sizeRatio", leg.sizeRatio, config),
      ].map((error) => ({ ...error, field: `leg${index + 1}_${error.field}` }));

      legErrors.forEach((error) => {
        if (error.type === "error") {
          allErrors.push(error);
        } else if (error.type === "warning") {
          allWarnings.push(error);
        }
      });
    });

    // Calculate completion percentage
    const totalFields = requiredFields.length + nestedValidations.length;
    const completedFields =
      requiredFields.filter((field) => {
        const value = field.includes(".")
          ? field.split(".").reduce((obj, key) => obj?.[key], config as any)
          : (config as any)[field];
        return value && value !== "";
      }).length + nestedValidations.filter(({ value }) => value > 0).length;

    const completionPercentage = Math.round(
      (completedFields / totalFields) * 100
    );

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      completionPercentage,
    };
  };

  // Auto-save effect
  useEffect(() => {
    const autoSaveKey = "botCreateWizard_autoSave";
    const savedConfig = localStorage.getItem(autoSaveKey);

    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        console.log("Auto-saved configuration loaded");
      } catch (error) {
        console.error("Failed to load auto-saved configuration:", error);
      }
    }
  }, []);

  // Real-time validation and auto-save effect
  useEffect(() => {
    const result = validateForm(config);
    setValidationResult(result);

    // Update field-specific errors and warnings
    const newFieldErrors: { [key: string]: string } = {};
    const newFieldWarnings: { [key: string]: string } = {};

    result.errors.forEach((error) => {
      newFieldErrors[error.field] = error.message;
    });

    result.warnings.forEach((warning) => {
      newFieldWarnings[warning.field] = warning.message;
    });

    setFieldErrors(newFieldErrors);
    setFieldWarnings(newFieldWarnings);

    // Auto-save configuration to localStorage
    const autoSaveKey = "botCreateWizard_autoSave";
    try {
      localStorage.setItem(autoSaveKey, JSON.stringify(config));
    } catch (error) {
      console.error("Failed to auto-save configuration:", error);
    }
  }, [config]);

  const handleInputChange = (field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => new Set([...prev, field]));
  };

  const handleNestedInputChange = (
    section: string,
    field: string,
    value: any
  ) => {
    setConfig((prev) => {
      const sectionValue = prev[section as keyof BotConfig];
      if (typeof sectionValue !== "object" || sectionValue === null) {
        return prev;
      }
      return {
        ...prev,
        [section]: { ...sectionValue, [field]: value },
      };
    });
    setTouchedFields((prev) => new Set([...prev, `${section}.${field}`]));
  };

  const handleDayToggle = (day: string) => {
    setConfig((prev) => {
      let newDays = [...prev.daysOfWeekToEnter];

      if (day === "ALL") {
        // If ALL is selected, clear others and set ALL
        newDays = ["ALL"];
      } else {
        // Remove ALL if selecting specific day
        newDays = newDays.filter((d) => d !== "ALL");

        if (newDays.includes(day)) {
          // Remove day if already selected
          newDays = newDays.filter((d) => d !== day);
        } else {
          // Add day if not selected
          newDays.push(day);
        }

        // If no days selected, default to ALL
        if (newDays.length === 0) {
          newDays = ["ALL"];
        }
      }

      return { ...prev, daysOfWeekToEnter: newDays };
    });
    setTouchedFields((prev) => new Set([...prev, "daysOfWeekToEnter"]));
  };

  const addLeg = () => {
    setConfig((prev) => ({
      ...prev,
      legs: [
        ...prev.legs,
        {
          targetType: "Target Type",
          strikeTarget: 0,
          optionType: "PUT",
          longOrShort: "LONG",
          sizeRatio: 1,
          daysToExpiration: "Exact",
          conflictResolution: "",
        },
      ],
    }));
  };

  const removeLeg = (index: number) => {
    if (config.legs.length > 1) {
      setConfig((prev) => ({
        ...prev,
        legs: prev.legs.filter((_, i) => i !== index),
      }));
    }
  };

  // Helper functions for validation display
  const getFieldError = (field: string): string | undefined => {
    return fieldErrors[field];
  };

  const getFieldWarning = (field: string): string | undefined => {
    return fieldWarnings[field];
  };

  const hasFieldError = (field: string): boolean => {
    return !!fieldErrors[field] && touchedFields.has(field);
  };

  const hasFieldWarning = (field: string): boolean => {
    return !!fieldWarnings[field] && touchedFields.has(field);
  };

  const getFieldClassName = (field: string, baseClassName: string): string => {
    if (hasFieldError(field)) {
      return `${baseClassName} border-red-500 bg-red-50/10`;
    }
    if (hasFieldWarning(field)) {
      return `${baseClassName} border-yellow-500 bg-yellow-50/10`;
    }
    if (
      touchedFields.has(field) &&
      !fieldErrors[field] &&
      !fieldWarnings[field]
    ) {
      return `${baseClassName} border-green-500 bg-green-50/10`;
    }
    return baseClassName;
  };

  const handleCreate = () => {
    if (
      !validationResult.isValid ||
      validationResult.completionPercentage < 100
    ) {
      alert(
        "Please complete all required fields and fix validation errors before creating the bot."
      );
      return;
    }

    console.log("Creating bot with config:", config);

    // Show success message
    alert(`Bot "${config.botName}" has been created successfully!`);

    // Clear auto-saved data after successful creation
    const autoSaveKey = "botCreateWizard_autoSave";
    localStorage.removeItem(autoSaveKey);

    // You would typically make an API call here to save the bot
    // Example: await createBot(config)
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all form data? This action cannot be undone."
      )
    ) {
      // Reset to initial state
      setConfig({
        // Bot Identification
        botName: "",
        tradingAccount: "",
        strategyAssignment: "",
        botStatus: "ENABLED",

        // Trading Strategy
        underlyingSymbol: "",
        tradeType: "",
        numberOfLegs: "One",
        skipAMExpirations: false,
        sellBidlessLongs: false,
        efficientSpreads: false,

        // Position Legs
        legs: [
          {
            targetType: "Target Type",
            strikeTarget: 0,
            optionType: "PUT",
            longOrShort: "LONG",
            sizeRatio: 1,
            daysToExpiration: "Exact",
            conflictResolution: "",
          },
        ],

        // Trade Entry
        enterBy: "",
        positionSizing: "QUANTITY",
        quantity: 1,
        includeCredit: false,
        autoSizeDown: false,
        entryTimeWindow: {
          start: "16",
          end: "00",
        },
        daysOfWeekToEnter: ["ALL"],
        openIfNoPosition: false,
        entrySpeed: "URGENT",
        entryTimeRandomization: "No Randomization",
        sequentialEntryDelay: "0s",

        // Trade Exit
        timedExit: false,
        profitTargetType: "DISABLED",
        disableProfitTargetAfterStop: false,

        // Trade Stop
        stopLossType: "DISABLED",
        trailingStops: false,

        // Trade Conditions
        entryFilters: {
          maxTradesPerDay: 1,
          isMaxTradesPerDayEnabled: false,
          maxConcurrentTrades: 1,
          isMaxConcurrentTradesEnabled: false,
          minimumPriceToEnter: 0,
          isMinimumPriceToEnterEnabled: false,
          maximumPriceToEnter: 0,
          isMaximumPriceToEnterEnabled: false,
          checkClosingsBeforeOpening: false,
          isEntryFiltersEnabled: false,
          isCheckClosingsEnabled: false,
          isAnyEnabled: false,
          isCreditEnabled: false,
          isDebitEnabled: false,
          onlyCreditOrDebit: "",
          isFirstFridayEnabled: false,
          isSkipEventDaysEnabled: false,
          isTimeEnabled: false,
          isFirstTickerEnabled: false,
          isToExpirationEnabled: false,
          isInTradeEnabled: false,
        },
        openingQuote: false,
        skipEventDays: false,

        // Bot Dependencies
        enableBotDependencies: false,

        // Bot Notes
        notes: "",

        // Webhook
        webhookEnabled: false,
      });

      // Clear validation state
      setTouchedFields(new Set());
      setFieldErrors({});
      setFieldWarnings({});

      // Clear auto-saved data
      const autoSaveKey = "botCreateWizard_autoSave";
      localStorage.removeItem(autoSaveKey);

      console.log("Form has been reset");
    }
  };

  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      // Navigate back or close modal
      window.history.back();
      console.log("Bot creation cancelled");
    }
  };

  const handleTestRun = () => {
    if (validationResult.errors.length > 0) {
      alert("Please fix all validation errors before running a test.");
      return;
    }

    console.log("Running test with config:", config);

    // Simulate test run
    alert(
      `Test run started for bot "${config.botName || "Unnamed Bot"}". Check the logs for results.`
    );

    // You would typically make an API call here to run the test
    // Example: await testBotStrategy(config)
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="px-3 mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Autotrader Bot
          </h1>
        </div>

        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Validation Summary */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Configuration Status
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      {validationResult.completionPercentage}% Complete
                    </span>
                  </div>
                  {validationResult.isValid &&
                    validationResult.completionPercentage === 100 && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Ready to Create
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    validationResult.completionPercentage === 100 &&
                    validationResult.isValid
                      ? "bg-green-500"
                      : validationResult.completionPercentage > 80
                        ? "bg-blue-500"
                        : validationResult.completionPercentage > 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${validationResult.completionPercentage}%` }}
                />
              </div>

              {/* Validation Messages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validationResult.errors.length > 0 && (
                  <div className="bg-red-900/20 border border-red-500 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg
                        className="w-4 h-4 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-red-400 font-medium text-sm">
                        {validationResult.errors.length} Error
                        {validationResult.errors.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <ul className="text-red-300 text-xs space-y-1">
                      {validationResult.errors
                        .slice(0, 3)
                        .map((error, index) => (
                          <li key={index}>• {error.message}</li>
                        ))}
                      {validationResult.errors.length > 3 && (
                        <li className="text-red-400">
                          ... and {validationResult.errors.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-500 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-yellow-400 font-medium text-sm">
                        {validationResult.warnings.length} Warning
                        {validationResult.warnings.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <ul className="text-yellow-300 text-xs space-y-1">
                      {validationResult.warnings
                        .slice(0, 3)
                        .map((warning, index) => (
                          <li key={index}>• {warning.message}</li>
                        ))}
                      {validationResult.warnings.length > 3 && (
                        <li className="text-yellow-400">
                          ... and {validationResult.warnings.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bot Identification Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Bot Identification
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bot Name
                    {hasFieldError("botName") && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={config.botName}
                    onChange={(e) =>
                      handleInputChange("botName", e.target.value)
                    }
                    onBlur={() =>
                      setTouchedFields((prev) => new Set([...prev, "botName"]))
                    }
                    placeholder="Give your bot a name or use choice. This is how the bot will be labeled."
                    className={getFieldClassName(
                      "botName",
                      "w-full bg-slate-700 border rounded px-3 py-2 text-white text-sm"
                    )}
                  />
                  {hasFieldError("botName") && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {getFieldError("botName")}
                    </p>
                  )}
                  {hasFieldWarning("botName") && (
                    <p className="text-yellow-400 text-xs mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {getFieldWarning("botName")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Trading Account ⓘ
                    {hasFieldError("tradingAccount") && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  <select
                    value={config.tradingAccount}
                    onChange={(e) =>
                      handleInputChange("tradingAccount", e.target.value)
                    }
                    onBlur={() =>
                      setTouchedFields(
                        (prev) => new Set([...prev, "tradingAccount"])
                      )
                    }
                    className={getFieldClassName(
                      "tradingAccount",
                      "w-full bg-slate-700 border rounded px-3 py-2 text-white text-sm"
                    )}
                  >
                    <option value="">
                      Select the account this bot should use for trading
                    </option>
                    <option value="account1">Account 1</option>
                    <option value="account2">Account 2</option>
                  </select>
                  {hasFieldError("tradingAccount") && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {getFieldError("tradingAccount")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Strategy Assignment ⓘ
                  </label>
                  <select
                    value={config.strategyAssignment}
                    onChange={(e) =>
                      handleInputChange("strategyAssignment", e.target.value)
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select Strategy</option>
                    <option value="iron-condor">Iron Condor</option>
                    <option value="put-spread">Put Spread</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bot Status
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInputChange("botStatus", "ENABLED")}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        config.botStatus === "ENABLED"
                          ? "bg-green-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      }`}
                    >
                      ENABLED
                    </button>
                    <button
                      onClick={() => handleInputChange("botStatus", "DISABLED")}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        config.botStatus === "DISABLED"
                          ? "bg-red-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      }`}
                    >
                      DISABLED
                    </button>
                  </div>
                </div>
              </div>
              {/*Action Buttons */}
              <div className="flex space-x-3 w-full">
                <button
                  onClick={handleCreate}
                  disabled={
                    !validationResult.isValid ||
                    validationResult.completionPercentage < 100
                  }
                  className={`flex-1 px-6 py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors ${
                    validationResult.isValid &&
                    validationResult.completionPercentage === 100
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <span>📄</span>
                  <span>CREATE</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>🔄</span>
                  <span>RESET</span>
                </button>

                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>✖</span>
                  <span>CANCEL</span>
                </button>

                <button
                  onClick={handleTestRun}
                  disabled={validationResult.errors.length > 0}
                  className={`flex-1 px-6 py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors ${
                    validationResult.errors.length === 0
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <span>🧪</span>
                  <span>TEST RUN</span>
                </button>
              </div>
            </div>

            {/* Trading Strategy Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Trading Strategy
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Underlying Symbol
                  </label>
                  <select
                    value={config.underlyingSymbol}
                    onChange={(e) =>
                      handleInputChange("underlyingSymbol", e.target.value)
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select Symbol</option>
                    <option value="SPY">SPY</option>
                    <option value="QQQ">QQQ</option>
                    <option value="IWM">IWM</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Symbol to trade</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Trade Type
                  </label>
                  <select
                    value={config.tradeType}
                    onChange={(e) =>
                      handleInputChange("tradeType", e.target.value)
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select Trade Type</option>
                    <option value="spread">Spread</option>
                    <option value="iron-condor">Iron Condor</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Trade template design for options legs
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Number of Legs
                  </label>
                  <select
                    value={config.numberOfLegs}
                    onChange={(e) =>
                      handleInputChange("numberOfLegs", e.target.value)
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="One">One</option>
                    <option value="Two">Two</option>
                    <option value="Three">Three</option>
                    <option value="Four">Four</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Number of legs for the position
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Skip AM Expirations ⓘ
                  </label>
                  <button
                    onClick={() =>
                      handleInputChange(
                        "skipAMExpirations",
                        !config.skipAMExpirations
                      )
                    }
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${
                      config.skipAMExpirations
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                    }`}
                  >
                    {config.skipAMExpirations ? "ENABLED" : "DISABLED"}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Ignores AM expirations for index options
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Sell Bidless Longs on Trade Exitⓘ
                  </label>
                  <button
                    onClick={() =>
                      handleInputChange(
                        "efficientSpreads",
                        !config.efficientSpreads
                      )
                    }
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${
                      config.efficientSpreads
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                    }`}
                  >
                    {config.efficientSpreads ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Efficient Spreads ⓘ
                  </label>
                  <button
                    onClick={() =>
                      handleInputChange(
                        "efficientSpreads",
                        !config.efficientSpreads
                      )
                    }
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${
                      config.efficientSpreads
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                    }`}
                  >
                    {config.efficientSpreads ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              </div>
            </div>

            {/* Position Legs Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Position Legs
              </h2>

              <div className="flex justify-between items-center mb-4">
                <div className="grid grid-cols-[5%_20%_10%_10%_10%_10%_10%_10%_10%_5%] gap-2 text-sm text-gray-400 flex-1 justify-items-start">
                  <div></div>
                  <div>Strike Target ⓘ</div>
                  <div></div>
                  <div>Option Type</div>
                  <div>Long/Short</div>
                  <div>Size Ratio</div>
                  <div></div>
                  <div>Days to Expiration</div>
                  <div>Conflict Resolution</div>
                  <div></div>
                </div>
              </div>
              {config.legs.map((leg, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[5%_20%_10%_10%_10%_10%_10%_10%_10%_5%] gap-2 text-sm text-gray-400 flex-1 h-[50px] items-center"
                >
                  <div className="flex items-center">
                    <span className="text-white font-medium">
                      Leg #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <select
                      value={leg.targetType}
                      onChange={(e) => {
                        const newLegs = [...config.legs];
                        newLegs[index].targetType = e.target.value;
                        handleInputChange("legs", newLegs);
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value="Target Type">Target Type</option>
                      <option value="ATM">ATM</option>
                      <option value="OTM">OTM</option>
                      <option value="ITM">ITM</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="number"
                      value={leg.strikeTarget}
                      onChange={(e) => {
                        const newLegs = [...config.legs];
                        newLegs[index].strikeTarget = Number(e.target.value);
                        handleInputChange("legs", newLegs);
                      }}
                      placeholder="Strike Target"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        const newLegs = [...config.legs];
                        newLegs[index].optionType = "PUT";
                        handleInputChange("legs", newLegs);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        leg.optionType === "PUT"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      }`}
                    >
                      PUT
                    </button>
                    <button
                      onClick={() => {
                        const newLegs = [...config.legs];
                        newLegs[index].optionType = "CALL";
                        handleInputChange("legs", newLegs);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        leg.optionType === "CALL"
                          ? "bg-green-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      }`}
                    >
                      CALL
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        const newLegs = [...config.legs];
                        newLegs[index].longOrShort = "LONG";
                        handleInputChange("legs", newLegs);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        leg.longOrShort === "LONG"
                          ? "bg-green-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      }`}
                    >
                      LONG
                    </button>
                    <button
                      onClick={() => {
                        const newLegs = [...config.legs];
                        newLegs[index].longOrShort = "SHORT";
                        handleInputChange("legs", newLegs);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        leg.longOrShort === "SHORT"
                          ? "bg-red-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      }`}
                    >
                      SHORT
                    </button>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="number"
                      value={leg.sizeRatio}
                      onChange={(e) => {
                        const newLegs = [...config.legs];
                        newLegs[index].sizeRatio = Number(e.target.value);
                        handleInputChange("legs", newLegs);
                      }}
                      placeholder="Size Ratio"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>

                  <div className="flex items-center">
                    <select
                      value={leg.daysToExpiration}
                      onChange={(e) => {
                        const newLegs = [...config.legs];
                        newLegs[index].daysToExpiration = e.target.value;
                        handleInputChange("legs", newLegs);
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value="Exact">Exact</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <select
                      value={leg.conflictResolution}
                      onChange={(e) => {
                        const newLegs = [...config.legs];
                        newLegs[index].conflictResolution = e.target.value;
                        handleInputChange("legs", newLegs);
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value="Skip">Skip</option>
                      <option value="Force">Force</option>
                      <option value="Adjust">Adjust</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs font-medium">
                      ENABLED
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    {config.legs.length > 1 && (
                      <button
                        onClick={() => removeLeg(index)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs font-medium transition-colors"
                        title="Remove Leg"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Trade Entry Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Trade Entry</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Enter By ⓘ
                  </label>
                  <div className="flex gap-1">
                    <label
                      onClick={() => handleInputChange("enterBy", "QUANTITY")}
                      className={`py-2 px-4 rounded text-sm font-medium transition-colors ${
                        config.enterBy === "QUANTITY"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      QUANTITY
                    </label>
                    <label
                      onClick={() =>
                        handleInputChange("enterBy", "LOTS_NUMBER")
                      }
                      className={`py-2 px-4 rounded text-sm font-medium transition-colors ${
                        config.enterBy === "LOTS_NUMBER"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      LOTS NUMBER
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Position Sizing
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        handleInputChange("positionSizing", "PREMIUM")
                      }
                      className={`py-2 px-4 rounded text-sm font-medium transition-colors ${
                        config.positionSizing === "PREMIUM"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      QUANTITY
                    </button>
                    <button
                      onClick={() =>
                        handleInputChange("positionSizing", "CONTRACTS")
                      }
                      className={`py-2 px-4 rounded text-sm font-medium transition-colors ${
                        config.positionSizing === "CONTRACTS"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      PERCENT
                    </button>
                    <button
                      onClick={() =>
                        handleInputChange("positionSizing", "CONTRACTS")
                      }
                      className={`py-2 px-4 rounded text-sm font-medium transition-colors ${
                        config.positionSizing === "CONTRACTS"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      LEVERAGE
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Auto Size Down ⓘ
                  </label>
                  <button
                    onClick={() =>
                      handleInputChange("autoSizeDown", !config.autoSizeDown)
                    }
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${
                      config.autoSizeDown
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                    }`}
                  >
                    {config.autoSizeDown ? "ENABLED" : "DISABLED"}
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Entry Time Window ⓘ
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">Start:</span>
                    <input
                      type="text"
                      value={config.entryTimeWindow.start}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "entryTimeWindow",
                          "start",
                          e.target.value
                        )
                      }
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                    <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                      <option>Hr</option>
                    </select>
                    <input
                      type="text"
                      value="00"
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                    <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                      <option>Min</option>
                    </select>
                    <input
                      type="text"
                      value="00"
                      className="w-12 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                    <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm">
                      <option>Sec</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Days of Week to Enter
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "ALL",
                      "SUN",
                      "MON",
                      "TUE",
                      "WED",
                      "THU",
                      "FRI",
                      "SAT",
                    ].map((day) => (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          config.daysOfWeekToEnter.includes(day)
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Open if No Position or Staggered Days ⓘ
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium">
                      NO POSITION
                    </button>
                    <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                      STAGGERED DAYS
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Sets if new positions are only opened if no position for the
                    bot is open or open new position at specified day intervals.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Entry Speed ⓘ
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {["URGENT", "FAST", "NORMAL", "SLOW", "TURTLE"].map(
                      (speed) => (
                        <button
                          key={speed}
                          onClick={() => handleInputChange("entrySpeed", speed)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            config.entrySpeed === speed
                              ? "bg-blue-600 text-white"
                              : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                          }`}
                        >
                          {speed}
                        </button>
                      )
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Entry price aggression and entry speed replacement speed for
                    trades and Early Speed
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Sequential Entry Delay ⓘ
                  </label>
                  <select
                    value={config.sequentialEntryDelay}
                    onChange={(e) =>
                      handleInputChange("sequentialEntryDelay", e.target.value)
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm mb-2"
                  >
                    <option value="0s">0s</option>
                    <option value="30s">30s</option>
                    <option value="1m">1m</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    Optional delay after of time once a trade to wait before the
                    but can make after a Trade
                  </p>
                </div>
              </div>
            </div>

            {/* Trade Exit Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Trade Exit</h2>

              <div className="mb-4 flex space-x-10">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Timed Exit ⓘ
                  </label>
                  <button
                    onClick={() =>
                      handleInputChange("timedExit", !config.timedExit)
                    }
                    className={`py-2 px-4 rounded text-sm font-medium ${
                      config.timedExit
                        ? "bg-blue-600 text-white"
                        : "bg-slate-600 text-gray-300"
                    }`}
                  >
                    {config.timedExit ? "DISABLED" : "ENABLED"}
                  </button>
                </div>

                {config.timedExit && (
                  <>
                    {/* Time Setting to Exit Trade */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Exit at Set Time
                      </label>
                      <div className="flex space-x-3 mb-1">
                        <label className="block text-sm font-medium text-gray-300 content-center">
                          {config.entryFilters.isInTradeEnabled
                            ? "TRADE DAY"
                            : "DATE"}
                        </label>
                        <input
                          type="number"
                          value="Days"
                          className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                        />
                        <label className="block text-sm font-medium text-gray-300 content-center rounded-xl">
                          TIME
                        </label>
                        <input
                          type="number"
                          value="Hr"
                          className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                        />
                        <label className="block text-sm font-medium text-gray-300 content-center">
                          MIN
                        </label>
                        <input
                          type="number"
                          value="Min"
                          className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Optional delay after of time once a trade to wait before
                        the but can make after a Trade
                      </p>
                    </div>

                    {/* Exit Days in Trade or Days to Expiration */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Exit Days in Trade or Days to Expiration ⓘ
                      </label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            handleNestedInputChange(
                              "entryFilters",
                              "isToExpirationEnabled",
                              !config.entryFilters.isToExpirationEnabled
                            );
                            if (!config.entryFilters.isToExpirationEnabled) {
                              handleNestedInputChange(
                                "entryFilters",
                                "isInTradeEnabled",
                                false
                              );
                            }
                          }}
                          className={`py-2 px-4 rounded text-sm font-medium ${
                            config.entryFilters.isToExpirationEnabled
                              ? "bg-blue-600 text-white"
                              : "bg-slate-600 text-gray-300"
                          }`}
                        >
                          TO EXPIRATION
                        </button>
                        <button
                          onClick={() => {
                            handleNestedInputChange(
                              "entryFilters",
                              "isInTradeEnabled",
                              !config.entryFilters.isInTradeEnabled
                            );
                            if (!config.entryFilters.isInTradeEnabled) {
                              handleNestedInputChange(
                                "entryFilters",
                                "isToExpirationEnabled",
                                false
                              );
                            }
                          }}
                          className={`py-2 px-4 rounded text-sm font-medium ${
                            config.entryFilters.isInTradeEnabled
                              ? "bg-blue-600 text-white"
                              : "bg-slate-600 text-gray-300"
                          }`}
                        >
                          IN TRADE
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Profit Target Type ⓘ
                </label>
                <div className="flex space-x-2 mb-4">
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    DISABLED
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    FIXED CLOSING CREDIT TARGET
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    FIXED PROFIT TARGET
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    PERCENT PROFIT TARGET
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Disable Profit Target After Stop ⓘ
                </label>
                <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                  DISABLED
                </button>
              </div>
            </div>

            {/* Trade Stop Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Trade Stop</h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Stop Loss Type ⓘ
                </label>
                <div className="flex space-x-2 mb-4">
                  <button className="bg-red-600 text-white py-2 px-4 rounded text-sm font-medium">
                    DISABLED
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    DOLLAR LOSS
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    PERCENT PROFIT
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    CLOSING PRICE PERCENT
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    FIXED DEBIT
                  </button>
                  <button className="bg-slate-600 text-gray-300 py-2 px-4 rounded text-sm font-medium">
                    SET STOP HELD (%)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Trailing Stop Configuration
                </label>
                <label className="block text-sm text-gray-400 mb-2">
                  Trailing Stops ⓘ
                </label>
                <button
                  onClick={() =>
                    handleInputChange("trailingStops", !config.trailingStops)
                  }
                  className={`py-2 px-4 rounded text-sm font-medium ${
                    config.trailingStops
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-gray-300"
                  }`}
                >
                  {config.trailingStops ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            </div>

            {/* Trade Conditions Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Trade Conditions
              </h2>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-white mb-3">
                  Entry Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Entry Filters
                      {hasFieldError("maxTradesPerDay") && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </label>
                    <button
                      onClick={() =>
                        handleNestedInputChange(
                          "entryFilters",
                          "isEntryFiltersEnabled",
                          !config.entryFilters.isEntryFiltersEnabled
                        )
                      }
                      className={`${
                        config.entryFilters.isEntryFiltersEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      {config.entryFilters.isEntryFiltersEnabled
                        ? "ENABLED"
                        : "ENABLE"}
                    </button>
                    {hasFieldError("maxTradesPerDay") && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {getFieldError("maxTradesPerDay")}
                      </p>
                    )}
                    {hasFieldWarning("maxTradesPerDay") && (
                      <p className="text-yellow-400 text-xs mt-1 flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {getFieldWarning("maxTradesPerDay")}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Enables filters based on the value or change in the
                      underlying or volatility index.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Max Trades Per Day
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleNestedInputChange(
                            "entryFilters",
                            "isMaxTradesPerDayEnabled",
                            !config.entryFilters.isMaxTradesPerDayEnabled
                          )
                        }
                        className={`${
                          config.entryFilters.isMaxTradesPerDayEnabled
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                      >
                        {config.entryFilters.isMaxTradesPerDayEnabled
                          ? "ENABLED"
                          : "ENABLE"}
                      </button>
                      {config.entryFilters.isMaxTradesPerDayEnabled && (
                        <input
                          type="number"
                          value={config.entryFilters.maxTradesPerDay}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "entryFilters",
                              "maxTradesPerDay",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Max Profit Targets Per Day
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleNestedInputChange(
                            "entryFilters",
                            "isMaxConcurrentTradesEnabled",
                            !config.entryFilters.isMaxConcurrentTradesEnabled
                          )
                        }
                        className={`${
                          config.entryFilters.isMaxConcurrentTradesEnabled
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                      >
                        {config.entryFilters.isMaxConcurrentTradesEnabled
                          ? "ENABLED"
                          : "ENABLE"}
                      </button>
                      {config.entryFilters.isMaxConcurrentTradesEnabled && (
                        <input
                          type="number"
                          value={config.entryFilters.maxConcurrentTrades}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "entryFilters",
                              "maxConcurrentTrades",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Maximum profit target closings before the bot stops
                      opening new trades for the day.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Minimum Price to Enter
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleNestedInputChange(
                            "entryFilters",
                            "isMinimumPriceToEnterEnabled",
                            !config.entryFilters.isMinimumPriceToEnterEnabled
                          )
                        }
                        className={`${
                          config.entryFilters.isMinimumPriceToEnterEnabled
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                      >
                        {config.entryFilters.isMinimumPriceToEnterEnabled
                          ? "ENABLED"
                          : "ENABLE"}
                      </button>
                      {config.entryFilters.isMinimumPriceToEnterEnabled && (
                        <input
                          type="number"
                          value={config.entryFilters.minimumPriceToEnter}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "entryFilters",
                              "minimumPriceToEnter",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      The minimum price that a trade will attempt to open.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Maximum Price to Enter
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleNestedInputChange(
                            "entryFilters",
                            "isMaximumPriceToEnterEnabled",
                            !config.entryFilters.isMaximumPriceToEnterEnabled
                          )
                        }
                        className={`${
                          config.entryFilters.isMaximumPriceToEnterEnabled
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600 text-gray-300"
                        } py-2 px-4 rounded text-sm font-medium`}
                      >
                        {config.entryFilters.isMaximumPriceToEnterEnabled
                          ? "ENABLED"
                          : "ENABLE"}
                      </button>
                      {config.entryFilters.isMaximumPriceToEnterEnabled && (
                        <input
                          type="number"
                          value={config.entryFilters.maximumPriceToEnter}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "entryFilters",
                              "maximumPriceToEnter",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      The maximum price that a trade will attempt to open.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Check Closings Before Opening ⓘ
                    </label>
                    <button
                      onClick={() =>
                        handleNestedInputChange(
                          "entryFilters",
                          "isCheckClosingsEnabled",
                          !config.entryFilters.isCheckClosingsEnabled
                        )
                      }
                      className={`${
                        config.entryFilters.isCheckClosingsEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      {config.entryFilters.isCheckClosingsEnabled
                        ? "ENABLED"
                        : "ENABLE"}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Disables searching closed trades and checks trades before
                      opening new trades
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Only Credit or Debit ⓘ
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        handleNestedInputChange(
                          "entryFilters",
                          "isAnyEnabled",
                          !config.entryFilters.isAnyEnabled
                        );
                        // Disable other buttons when ANY is enabled
                        if (!config.entryFilters.isAnyEnabled) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isCreditEnabled",
                            false
                          );
                          handleNestedInputChange(
                            "entryFilters",
                            "isDebitEnabled",
                            false
                          );
                        }
                      }}
                      className={`${
                        config.entryFilters.isAnyEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      ANY
                    </button>
                    <button
                      onClick={() => {
                        handleNestedInputChange(
                          "entryFilters",
                          "isCreditEnabled",
                          !config.entryFilters.isCreditEnabled
                        );
                        // Disable other buttons when CREDIT is enabled
                        if (!config.entryFilters.isCreditEnabled) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isAnyEnabled",
                            false
                          );
                          handleNestedInputChange(
                            "entryFilters",
                            "isDebitEnabled",
                            false
                          );
                        }
                      }}
                      className={`${
                        config.entryFilters.isCreditEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      CREDIT
                    </button>
                    <button
                      onClick={() => {
                        handleNestedInputChange(
                          "entryFilters",
                          "isDebitEnabled",
                          !config.entryFilters.isDebitEnabled
                        );
                        // Disable other buttons when DEBIT is enabled
                        if (!config.entryFilters.isDebitEnabled) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isAnyEnabled",
                            false
                          );
                          handleNestedInputChange(
                            "entryFilters",
                            "isCreditEnabled",
                            false
                          );
                        }
                      }}
                      className={`${
                        config.entryFilters.isDebitEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      DEBIT
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Use this for 15 at 9:30-14:30 AM to see the underlying's
                    opening quote and check SOX applications
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Opening Quote ⓘ
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        const newTimeState = !config.entryFilters.isTimeEnabled;
                        handleNestedInputChange(
                          "entryFilters",
                          "isTimeEnabled",
                          newTimeState
                        );
                        if (newTimeState) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isFirstTickerEnabled",
                            false
                          );
                        }
                      }}
                      className={`${
                        config.entryFilters.isTimeEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      9:30:20
                    </button>
                    <button
                      onClick={() => {
                        const newTickerState =
                          !config.entryFilters.isFirstTickerEnabled;
                        handleNestedInputChange(
                          "entryFilters",
                          "isFirstTickerEnabled",
                          newTickerState
                        );
                        if (newTickerState) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isTimeEnabled",
                            false
                          );
                        }
                      }}
                      className={`${
                        config.entryFilters.isFirstTickerEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      First Ticker
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Use this for 15 at 9:30-14:30 AM to see the underlying's
                    opening quote and check SOX applications
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Skip Event Days ⓘ
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <button
                      onClick={() => {
                        const newFirstFridayState =
                          !config.entryFilters.isFirstFridayEnabled;
                        handleNestedInputChange(
                          "entryFilters",
                          "isFirstFridayEnabled",
                          newFirstFridayState
                        );
                        if (newFirstFridayState) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isSkipEventDaysEnabled",
                            false
                          );
                        }
                      }}
                      className={`${
                        config.entryFilters.isFirstFridayEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      FIRST FRI
                    </button>
                    <button
                      onClick={() => {
                        const newSkipEventDaysState =
                          !config.entryFilters.isSkipEventDaysEnabled;
                        handleNestedInputChange(
                          "entryFilters",
                          "isSkipEventDaysEnabled",
                          newSkipEventDaysState
                        );
                        if (newSkipEventDaysState) {
                          handleNestedInputChange(
                            "entryFilters",
                            "isFirstFridayEnabled",
                            false
                          );
                        }
                      }}
                      className={`${
                        config.entryFilters.isSkipEventDaysEnabled
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300"
                      } py-2 px-4 rounded text-sm font-medium`}
                    >
                      ENABLED
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Skip window or opt to trade on FOMC and EOD. and the day of
                    and after a Federal Reserve FOMC meeting. and OPEX
                  </p>
                </div>
              </div>
            </div>

            {/* Bot Dependencies Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Bot Dependencies
              </h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Enable Bot Dependencies
                </label>
                <button
                  onClick={() =>
                    handleInputChange(
                      "enableBotDependencies",
                      !config.enableBotDependencies
                    )
                  }
                  className={`py-2 px-4 rounded text-sm font-medium ${
                    config.enableBotDependencies
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-gray-300"
                  }`}
                >
                  {config.enableBotDependencies ? "ENABLED" : "DISABLED"}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Open or Force Stop this bot when certain bots are open and
                  open or there been in a trade today
                </p>
              </div>
            </div>

            {/* Bot Notes Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Bot Notes</h2>

              <textarea
                value={config.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add notes about this bot..."
                rows={6}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-3 text-white resize-none"
              />
            </div>

            {/* Webhook Remote Control Section */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Webhook Remote Control
              </h2>

              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-4">
                  Webhooks are disabled for your account. To enable them, please
                  visit Account Settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Footer Note */}
        {!validationResult.isValid && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-6">
            <div className="flex items-center space-x-2 text-yellow-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Complete all required fields to create your bot
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Fix the validation errors above and ensure all required fields are
              filled out before creating your bot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
