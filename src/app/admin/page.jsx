"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function AdminDashboard() {
  const [selectedOption, setSelectedOption] = useState("Users");
  const [data, setData] = useState([]);

  const fetchData = async (table) => {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`Error fetching ${table}:`, error);
    } else {
      setData(data);
    }
  };

  const handleMenuClick = (option) => {
    setSelectedOption(option);
    fetchData(option === "Schools" ? "universities" : option.toLowerCase());
  };

  // Fetch the data for the default selection when the component mounts
  useEffect(() => {
    fetchData(selectedOption.toLowerCase());
  }, [selectedOption]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex">
        {/* Left Column */}
        <div className="w-1/4 bg-gray-200 p-4">
          <h2 className="text-xl font-bold mb-4 text-black">Admin Dashboard</h2>
          <ul className="space-y-2">
            {["Users", "Schools", "Professors", "Reviews"].map((option) => (
              <li
                key={option}
                className={`cursor-pointer p-2 rounded ${
                  selectedOption === option
                    ? "bg-blue-500 text-white"
                    : "text-black hover:bg-gray-300"
                }`}
                onClick={() => handleMenuClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div className="w-3/4 bg-white p-4">
          <h2 className="text-2xl font-bold mb-4 text-black">{selectedOption}</h2>
          {data.length > 0 ? (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-2 border-b-2 border-gray-300 text-left text-sm font-bold text-black uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td
                        key={i}
                        className="px-4 py-2 border-b border-gray-300 text-sm text-black"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-black">No data available for {selectedOption}.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
