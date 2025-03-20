import React, { useState } from 'react';
import TableWithGrouping from '../../components/datagrid/GridComponent';

const FileMaintenance = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [file, setFile] = useState(null);
  const [updateGrid, setUpdateGrid] = useState(false);

  const handleMonthChange = (event) => setSelectedMonth(event.target.value);
  const handleServiceChange = (event) => setSelectedService(event.target.value);
  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedMonth || !selectedService || !file) {
      alert('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('month', selectedMonth);
    formData.append('service', selectedService);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/maintenance', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Maintenance data added successfully!');
        setSelectedMonth('');
        setSelectedService('');
        setFile(null);
        setUpdateGrid((prev) => !prev); // Trigger grid update
      } else {
        throw new Error(result.message || 'Failed to submit form');
      }
    } catch (error) {
      alert('Error submitting form: ' + error.message);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const services = [
    "CONSUMER STORE", "BAKERY PRODUCTION", "GARMENTS PRODUCTION",
    "ATM WITHDRAW & BALANCE", "GCASH (IN & OUT)", "PRINTING SERVICES",
    "PSA, CENOMAR, DEATH CERT", "TRUEMONEY"
  ];

  return (
    <div className="min-h-96">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4 mb-6 p-6 bg-white shadow-lg rounded-lg">
          {/* Month Selector */}
          <div className="flex-1 min-w-[280px]">
            <label htmlFor="month-select" className="block text-lg font-medium text-gray-700 mb-2">
              Select Month:
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">--Please choose a month--</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Service Selector */}
          <div className="flex-1 min-w-[280px]">
            <label htmlFor="service-select" className="block text-lg font-medium text-gray-700 mb-2">
              Select Service:
            </label>
            <select
              id="service-select"
              value={selectedService}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">--Please choose a service--</option>
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="flex-1 min-w-[280px]">
            <label htmlFor="file-upload" className="block text-lg font-medium text-gray-700 mb-2">
              Attach File:
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-2">
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Data Grid */}
      <div className="mt-4">
        <TableWithGrouping key={updateGrid} />
      </div>
    </div>
  );
};

export default FileMaintenance;
