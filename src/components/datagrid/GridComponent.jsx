import React, { useState, useEffect, useCallback } from "react";

function TableWithGrouping() {
  const [data, setData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString("en-us", { month: "long" }));
  const [activeGroups, setActiveGroups] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/api/maintenance/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();

      if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
        console.warn("No data found or incorrect format");
        setData([]); // Ensure data is cleared if nothing is found
        return;
      }

      setData(jsonData);

      // Set current month from the first record if available
      if (jsonData[0]?.month) {
        setCurrentMonth(jsonData[0].month);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update the current month based on button click.
  const paginate = (month) => {
    setCurrentMonth(month);
  };

  // Toggle group expansion/collapse by group key.
  const toggleGroup = (groupKey) => {
    setActiveGroups((prev) =>
      prev.includes(groupKey) ? prev.filter((key) => key !== groupKey) : [...prev, groupKey]
    );
  };

  // Filter data based on the selected month.
  const filteredData = data.filter((group) => group.month === currentMonth);

  return (
    <div className="flex flex-col">
      {/* Month Selector Buttons */}
      <div className="flex justify-center space-x-2 mb-4">
        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => paginate(month)}
            className={`px-2 py-1 text-sm border rounded ${
              currentMonth === month
                ? "bg-blue-500 text-white"
                : "text-blue-600 border-blue-600 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="p-6 overflow-hidden flex-grow min-h-[500px]">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year/Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membership Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Purchased/Accumulated Service Fee
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No records available for {currentMonth}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((group) => {
                    // Create a unique key for this group using year and month.
                    const groupKey = `${group.year}-${group.month}`;
                    return (
                      <React.Fragment key={groupKey}>
                        <tr
                          className="bg-gray-100 cursor-pointer hover:bg-gray-200"
                          onClick={() => toggleGroup(groupKey)}
                        >
                          <td colSpan={6} className="px-6 py-2 text-sm font-medium text-gray-900">
                            Year: {group.year} - Month: {group.month} - {group.data.length} items
                          </td>
                        </tr>
                        {activeGroups.includes(groupKey) &&
                          group.data.map((record, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                {group.month} - {group.year}
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                {record.memberCode || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                {record.name}
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                {record.status || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                {record.service || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                {record.totalPurchaseServiceFee || "N/A"}
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableWithGrouping;
