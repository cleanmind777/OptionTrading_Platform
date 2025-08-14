import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchOptionContracts } from "../utils/FetchPolygonBars";
export interface LineDataElement {
  id: string;
  name: string;
  settings: {
    view: boolean;
    symbol: string;
    date: string;
    contracts: any[]; // Use contracts instead of price
    selectedPrice?: number;
    selectedTicker?: string;
    title: string;
    color: string;
    contractType: "call" | "put";
  };
}

interface LineDataSettingsProps {
  symbol: string;
  onUpdateLineData: (elements: LineDataElement[]) => void;
}

function LineDataSettings({ symbol, onUpdateLineData }: LineDataSettingsProps) {
  const [lineDataElements, setLineDataElements] = useState<LineDataElement[]>(
    []
  );
  const [targetID, setTargetID] = useState("");
  let settingKey = "";
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const fetchPriceData = async (
    id: string,
    symbol: string,
    type: string,
    date: string
  ): Promise<any[]> => {
    try {
      const filter1 = {
        expiration_date: date,
        contract_type: type,
        underlying_ticker: symbol,
        expired: false,
      };
      const filter2 = {
        expiration_date: date,
        contract_type: type,
        underlying_ticker: symbol,
        expired: true,
      };
      let response = await fetchOptionContracts(filter1);
      if (response.length == 0) {
        response = await fetchOptionContracts(filter2);
      }
      return response;
    } catch (error) {
      console.error("Error fetching price data:", error);
      return [];
    }
  };
  const addLineDataElement = () => {
    const newElement: LineDataElement = {
      id: Date.now().toString(),
      name: `Line Data ${lineDataElements.length + 1}`,
      settings: {
        view: true,
        symbol: symbol,
        date: "",
        contracts: [], // Use contracts instead of price
        selectedPrice: undefined,
        selectedTicker: undefined,
        title: `Line ${lineDataElements.length + 1}`,
        color: getRandomColor(), // Use a random color
        contractType: "call",
      },
    };
    setLineDataElements([...lineDataElements, newElement]);
    onUpdateLineData([...lineDataElements, newElement]);
  };

  const removeLineDataElement = (id: string) => {
    const filteredElements = lineDataElements.filter(
      (element) => element.id !== id
    );
    setLineDataElements(filteredElements);
    onUpdateLineData(filteredElements);
  };

  const updateElementName = (id: string, name: string) => {
    const updatedElements = lineDataElements.map((element) =>
      element.id === id ? { ...element, name } : element
    );
    setLineDataElements(updatedElements);
    onUpdateLineData(updatedElements);
  };

  const updateElementSetting = async (
    id: string,
    settingKey: keyof LineDataElement["settings"],
    value: any
  ) => {
    // Create updated elements with the new value
    const updatedElements = lineDataElements.map((element) =>
      element.id === id
        ? {
            ...element,
            settings: {
              ...element.settings,
              [settingKey]: value,
            },
          }
        : element
    );

    // Update state immediately
    setLineDataElements(updatedElements);
    onUpdateLineData(updatedElements);

    // If contract type or date changes, fetch new price data
    if (settingKey === "contractType" || settingKey === "date") {
      const element = updatedElements.find((el) => el.id === id);
      if (element && element.settings.symbol && element.settings.date) {
        try {
          const contract = await fetchPriceData(
            id,
            element.settings.symbol,
            element.settings.contractType,
            element.settings.date
          );

          // Update the elements with the new price data
          const elementsWithPrice = updatedElements.map((element) =>
            element.id === id
              ? {
                  ...element,
                  settings: {
                    ...element.settings,
                    contracts: contract,
                  },
                }
              : element
          );

          // Update state with the new price data
          setLineDataElements(elementsWithPrice);
          onUpdateLineData(elementsWithPrice);
        } catch (error) {
          console.error("Error fetching price data:", error);
        }
      }
    }
  };

  const commonInputStyle = {
    backgroundColor: "#21262D",
    border: "1px solid #30363D",
    borderRadius: "6px",
    padding: "6px 10px",
    color: "#E6EDF3",
    fontSize: "13px",
    height: "32px",
    fontWeight: "600",
    width: "100%",
  };
  return (
    <div
      style={{
        backgroundColor: "#161B22",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        marginBottom: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h3
          style={{
            color: "#4cc9f0",
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          📊 Line Data Settings
        </h3>
        <button
          onClick={addLineDataElement}
          style={{
            backgroundColor: "#238636",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "32px",
          }}
        >
          ➕ Add Line Data
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #30363D" }}>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              Name
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              View
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              Symbol
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              Contract Type
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              Date
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              Prices
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              Ticker
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              Color
            </th>

            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#8B949E",
                fontSize: "12px",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {lineDataElements.map((element) => (
            <tr key={element.id} style={{ borderBottom: "1px solid #30363D" }}>
              <td style={{ padding: "8px" }}>
                <input
                  type="text"
                  value={element.name}
                  onChange={(e) =>
                    updateElementName(element.id, e.target.value)
                  }
                  style={commonInputStyle}
                  placeholder="Enter line data name..."
                />
              </td>
              <td style={{ padding: "8px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <input
                    type="checkbox"
                    checked={element.settings.view}
                    onChange={(e) =>
                      updateElementSetting(element.id, "view", e.target.checked)
                    }
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#4cc9f0",
                    }}
                  />
                </div>
              </td>
              <td style={{ padding: "8px" }}>
                <div
                  style={{
                    ...commonInputStyle,
                    backgroundColor: "#161B22", // Make it look like a read-only field
                    cursor: "default", // Disable pointer interaction
                  }}
                >
                  {element.settings.symbol}
                </div>
              </td>
              <td style={{ padding: "8px" }}>
                <select
                  value={element.settings.contractType}
                  onChange={(e) =>
                    updateElementSetting(
                      element.id,
                      "contractType",
                      e.target.value as "call" | "put"
                    )
                  }
                  style={commonInputStyle}
                >
                  <option value="call">Call</option>
                  <option value="put">Put</option>
                </select>
              </td>
              <td style={{ padding: "8px" }}>
                <input
                  type="date"
                  value={element.settings.date}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    updateElementSetting(element.id, "date", newDate);
                  }}
                  style={commonInputStyle}
                />
              </td>
              <td style={{ padding: "8px" }}>
                <select
                  value={element.settings.selectedPrice || ""}
                  onChange={(e) => {
                    const selectedPrice = parseFloat(e.target.value);
                    const selectedContract = element.settings.contracts.find(
                      (contract) => contract.strike_price === selectedPrice
                    );

                    // Update both selectedPrice and selectedTicker in a single state update
                    const updatedElements = lineDataElements.map((el) =>
                      el.id === element.id
                        ? {
                            ...el,
                            settings: {
                              ...el.settings,
                              selectedPrice: selectedPrice,
                              selectedTicker: selectedContract?.ticker || "",
                            },
                          }
                        : el
                    );

                    setLineDataElements(updatedElements);
                    onUpdateLineData(updatedElements);
                  }}
                  style={commonInputStyle}
                >
                  <option value="">Select a price</option>
                  {element.settings.contracts.map((contract, index) => (
                    <option key={index} value={contract.strike_price}>
                      {contract.strike_price}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ padding: "8px" }}>
                <div
                  style={{
                    ...commonInputStyle,
                    backgroundColor: "#161B22", // Make it look like a read-only field
                    cursor: "default", // Disable pointer interaction
                  }}
                >
                  {element.settings.selectedTicker || "N/A"}
                </div>
              </td>
              <td style={{ padding: "8px" }}>
                <input
                  type="color"
                  value={element.settings.color}
                  onChange={(e) =>
                    updateElementSetting(element.id, "color", e.target.value)
                  }
                  style={{
                    ...commonInputStyle,
                    padding: "3px",
                    cursor: "pointer",
                  }}
                />
              </td>

              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => removeLineDataElement(element.id)}
                  style={{
                    backgroundColor: "#da3633",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                    height: "32px",
                    width: "100%",
                  }}
                >
                  🗑️ Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {lineDataElements.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#8B949E",
            padding: "30px 20px",
            fontSize: "14px",
            backgroundColor: "#0D1117",
            borderRadius: "8px",
            border: "2px dashed #30363D",
            fontWeight: "600",
            marginTop: "15px",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>📊</div>
          <div style={{ marginBottom: "4px", fontWeight: "600" }}>
            No Line Data Elements
          </div>
          <div style={{ fontSize: "12px", fontWeight: "600" }}>
            Click "Add Line Data" to create your first element
          </div>
        </div>
      )}
    </div>
  );
}

export default LineDataSettings;
