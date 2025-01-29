const Legend = ({ selectedLayer }) => {
  const legendItems = {
    temperature: [
      { label: "Extreme Cold (-30°C)", color: "#003366" },
      { label: "Very Cold (-20°C)", color: "#4A90E2" },
      { label: "Cold (-10°C)", color: "#B3DFFD" },
      { label: "Freezing Point (0°C)", color: "#E6F7FF" },
      { label: "Cool (+10°C)", color: "#D1F2D3" },
      { label: "Mild (+20°C)", color: "#FFFACD" },
      { label: "Warm (+30°C)", color: "#FFCC80" },
      { label: "Hot (+40°C)", color: "#FF7043" },
      { label: "Extreme Heat (+50°C)", color: "#D32F2F" },
    ],
    wind: [
      { label: "0–10 km/h", color: "#E0F7FA" },
      { label: "10–20 km/h", color: "#B2EBF2" },
      { label: "20–40 km/h", color: "#4DD0E1" },
      { label: "40–60 km/h", color: "#0288D1" },
      { label: "60+ km/h", color: "#01579B" },
    ],
    cloud: [
      { label: "0–10%", color: "#FFF9C4" },
      { label: "10–30%", color: "#FFF176" },
      { label: "30–60%", color: "#E0E0E0" },
      { label: "60–90%", color: "#9E9E9E" },
      { label: "90–100%", color: "#616161" },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold mb-2">
        {selectedLayer === "temperature"
          ? "Havo Harorati"
          : selectedLayer === "wind"
          ? "Shamol Tezligi"
          : "Bulutlilik"}
      </h3>
      <div className="space-y-2">
        {legendItems[selectedLayer].map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
