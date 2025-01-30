"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import Legend from "@/components/legend";

const Main = () => {
  const router = useRouter();
  const [selectedLayer, setSelectedLayer] = useState("temperature");
  const [data, setData] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.username || !user.password) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = localStorage.getItem("weatherData");
      const cachedTimestamp = localStorage.getItem("weatherDataTimestamp");
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (cachedData && cachedTimestamp && now - cachedTimestamp < oneHour) {
        setData(JSON.parse(cachedData));
      } else {
        try {
          const responses = await Promise.all(
            validCountries.map((country) =>
              axios.get(
                `https://api.weatherapi.com/v1/current.json?key=bb99d1215f024ea4849181522252801&q=${country}&aqi=no`
              )
            )
          );

          const weatherData = responses.reduce((acc, res, index) => {
            acc[validCountries[index]] = {
              temperature: res.data.current.temp_c,
              wind: res.data.current.wind_kph,
              cloud: res.data.current.cloud,
            };
            return acc;
          }, {});

          localStorage.setItem("weatherData", JSON.stringify(weatherData));
          localStorage.setItem("weatherDataTimestamp", now.toString());
          setData(weatherData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

  const handleMouseMove = (e, countryName) => {
    if (data && data[countryName]) {
      setHoveredCountry({
        name: countryName,
        temperature: data[countryName].temperature,
        wind: data[countryName].wind,
        cloud: data[countryName].cloud,
      });
      setTooltipPosition({ x: e.pageX + 10, y: e.pageY + 10 });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  const getColor = (country) => {
    if (!data || !data[country]) return "#ccc";
    const value = data[country][selectedLayer];

    if (selectedLayer === "temperature") {
      if (value <= -30) return "#003366";
      if (value <= -20) return "#4A90E2";
      if (value <= -10) return "#B3DFFD";
      if (value <= 0) return "#E6F7FF";
      if (value <= 10) return "#D1F2D3";
      if (value <= 20) return "#FFFACD";
      if (value <= 30) return "#FFCC80";
      if (value <= 40) return "#FF7043";
      return "#D32F2F";
    }

    if (selectedLayer === "wind") {
      if (value <= 10) return "#E0F7FA";
      if (value <= 20) return "#B2EBF2";
      if (value <= 40) return "#4DD0E1";
      if (value <= 60) return "#0288D1";
      return "#01579B";
    }

    if (selectedLayer === "cloud") {
      if (value <= 10) return "#FFF9C4";
      if (value <= 30) return "#FFF176";
      if (value <= 60) return "#E0E0E0";
      if (value <= 90) return "#9E9E9E";
      return "#616161";
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-3">
        <div className="w-full w-6xl flex gap-4">
          <div className="flex-1 relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 100 }}
            >
              <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const fillColor = getColor(countryName);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#D6D6DA"
                        onMouseMove={(e) => handleMouseMove(e, countryName)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            outline: "none",
                            stroke: "#000",
                            strokeWidth: 1.5,
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            {hoveredCountry && (
              <div
                style={{
                  position: "absolute",
                  left: tooltipPosition.x,
                  top: tooltipPosition.y,
                  backgroundColor: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <strong>{hoveredCountry.name}</strong>
                <p>Harorat: {hoveredCountry.temperature}°C</p>
                <p>Shamol tezligi: {hoveredCountry.wind} km/h</p>
                <p>Bulutlilik: {hoveredCountry.cloud}%</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Legend selectedLayer={selectedLayer} />
            <div className="flex justify-center gap-2">
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLayer === "temperature"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedLayer("temperature")}
              >
                Havo harorati
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLayer === "wind"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedLayer("wind")}
              >
                Shamol
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLayer === "cloud"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedLayer("cloud")}
              >
                Bulutlilik
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
