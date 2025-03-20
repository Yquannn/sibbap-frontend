import React, { useEffect, useState } from "react";

const PersonalInformation = ({
  handleNext,
  formData,
  setFormData,
  fetchedData,
}) => {
  // Define default values for all fields.
  const defaultInfo = {
    memberCode: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    date_of_birth: "",
    birthplace_province: "",
    age: "",
    civil_status: "",
    sex: "",
    number_of_dependents: "",
    spouse_name: "",
    spouse_occupation_source_of_income: "",
    occupation_source_of_income: "",
    annual_income: "",
    employer_address: "",
    employer_address2: "",
  };

  // Use existing formData or default info.
  const personalInfo = formData.personalInfo || defaultInfo;

  // Merge fetchedData only if the user hasn't already modified the fields.
  // (Here we assume that fetchedData always has a valid memberCode.)
  useEffect(() => {
    if (fetchedData && !personalInfo.memberCode) {
      const filteredData = Object.keys(defaultInfo).reduce((acc, key) => {
        if (fetchedData[key] !== undefined) {
          acc[key] = fetchedData[key];
        }
        return acc;
      }, {});
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...defaultInfo,
          ...prevData.personalInfo,
          ...filteredData,
        },
      }));
    }
  }, [fetchedData, setFormData, personalInfo.memberCode]);

  const [errors, setErrors] = useState({});

  // Helper to format ISO date strings to "yyyy-MM-dd"
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months are zero-indexed.
    let dd = date.getDate();
    mm = mm < 10 ? `0${mm}` : mm;
    dd = dd < 10 ? `0${dd}` : dd;
    return `${yyyy}-${mm}-${dd}`;
  };

  // Update form data on input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [name]: value,
      },
    }));
  };

  // Basic validation (currently always returns true).
  const validateForm = () => true;

  const handleNextClick = (event) => {
    event.preventDefault();
    if (validateForm()) {
      handleNext();
    }
  };

  // Define the fields to display.
  const fields = [
    { label: "Member Code", name: "memberCode", type: "text" },
    { label: "Last Name", name: "last_name", type: "text", required: true },
    { label: "First Name", name: "first_name", type: "text", required: true },
    { label: "Middle Name", name: "middle_name", type: "text" },
    { label: "Date of Birth", name: "date_of_birth", type: "date" },
    { label: "Place of Birth", name: "birthplace_province", type: "text" },
    { label: "Age", name: "age", type: "number" },
    {
      label: "Civil Status",
      name: "civil_status",
      type: "select",
      options: ["Single", "Married", "Widow", "Separated"],
    },
    {
      label: "Gender",
      name: "sex",
      type: "select",
      options: ["Male", "Female", "Other"],
    },
    { label: "Employer/Address 1", name: "employer_address", type: "text" },
    { label: "No. of Dependents", name: "number_of_dependents", type: "number" },
    { label: "Spouse Name", name: "spouse_name", type: "text" },
    {
      label: "Spouse Occupation/Source of Income",
      name: "spouse_occupation_source_of_income",
      type: "text",
    },
    {
      label: "Occupation/Source of Income",
      name: "occupation_source_of_income",
      type: "text",
    },
    { label: "Annual Income", name: "annual_income", type: "number" },
    { label: "Employer/Address 2", name: "employer_address2", type: "text" },
  ];

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {fields.map((field, index) => {
        if (field.type === "select") {
          return (
            <label key={index} className="block">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
              <select
                className={`border p-3 rounded-lg w-full ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
                name={field.name}
                value={personalInfo[field.name] || ""}
                onChange={handleChange}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name]}</p>
              )}
            </label>
          );
        } else if (field.type === "date") {
          return (
            <label key={index} className="block">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
              <input
                className={`border p-3 rounded-lg w-full ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
                name={field.name}
                type="date"
                value={formatDateForInput(personalInfo[field.name])}
                onChange={handleChange}
                placeholder={field.label}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name]}</p>
              )}
            </label>
          );
        } else {
          return (
            <label key={index} className="block">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
              <input
                className={`border p-3 rounded-lg w-full ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
                name={field.name}
                type={field.type}
                value={personalInfo[field.name] || ""}
                onChange={handleChange}
                placeholder={field.label}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name]}</p>
              )}
            </label>
          );
        }
      })}
      <div className="flex justify-end col-span-full">
        <button
          className="bg-green-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-800 transition-all"
          onClick={handleNextClick}
          type="button"
        >
          <span className="text-2xl">&#187;&#187;</span> Next
        </button>
      </div>
    </form>
  );
};

export default PersonalInformation;
