import React, { useState, useEffect } from "react";

const PersonalInformation = ({
  handleNext,
  formData,
  setFormData,
  fetchedData,
  mode = "registration" // "registration" or "loan"
}) => {
  // Define default values based on the mode.
  const defaultInfo =
    mode === "loan"
      ? {
          // Loan mode: No member type/registration type, monthly income instead.
          last_name: "",
          middle_name: "",
          first_name: "",
          maiden_name: "",
          extension_name: "",
          date_of_birth: "",
          birthplace_province: "",
          age: "",
          religion: "",
          sex: "",
          civil_status: "",
          highest_educational_attainment: "",
          occupation_source_of_income: "",
          monthly_income: "",
          tin_number: "",
          number_of_dependents: "",
          spouse_name: "",
          spouse_occupation_source_of_income: ""
        }
      : {
          // Registration mode: Include member type & registration type, and annual income.
          member_type: "Regular member",
          registration_type: "",
          last_name: "",
          middle_name: "",
          first_name: "",
          maiden_name: "",
          extension_name: "",
          date_of_birth: "",
          birthplace_province: "",
          age: "",
          religion: "",
          sex: "",
          civil_status: "",
          highest_educational_attainment: "",
          occupation_source_of_income: "",
          annual_income: "",
          tin_number: "",
          number_of_dependents: "",
          spouse_name: "",
          spouse_occupation_source_of_income: ""
        };

  // Use parent's formData.personalInfo or initialize with defaults.
  const personalInfo = formData.personalInfo || defaultInfo;

  // When fetchedData becomes available, update the form state.
  useEffect(() => {
    if (fetchedData) {
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...defaultInfo,           // start with default values
          ...prevData.personalInfo, // preserve any existing values
          ...fetchedData            // overwrite with fetched data
        }
      }));
    }
  }, [fetchedData, setFormData, defaultInfo]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...personalInfo,
        [name]: value
      }
    }));
  };

  // Validate the form before moving to the next step.
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate Age: must be provided and at least 18.
    const ageValue = parseInt(personalInfo.age, 10);
    if (!personalInfo.age) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(ageValue) || ageValue < 18) {
      newErrors.age = "Member is not eligible (must be at least 18 years old)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // useEffect to validate age as soon as it changes.
  useEffect(() => {
    const ageValue = parseInt(personalInfo.age, 10);
    if (personalInfo.age !== "" && (isNaN(ageValue) || ageValue < 18)) {
      setErrors((prev) => ({
        ...prev,
        age: "Member is not eligible (must be at least 18 years old)"
      }));
    } else {
      setErrors((prev) => {
        const { age, ...others } = prev;
        return others;
      });
    }
  }, [personalInfo.age]);

  // useEffect to clear the maiden name if civil status is Single.
  useEffect(() => {
    if (personalInfo.civil_status === "Single") {
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          maiden_name: ""
        }
      }));
    }
  }, [personalInfo.civil_status, setFormData]);

  const handleNextClick = (event) => {
    event.preventDefault();
    if (validateForm()) {
      handleNext();
    }
  };

  // Define the fields that will always be present.
  // Note: We keep the existing setup for textInputs and dropdowns.
  const textInputs = [
    { label: "Last Name", name: "last_name", type: "text", required: true },
    { label: "Middle Name", name: "middle_name", type: "text" },
    { label: "First Name", name: "first_name", type: "text", required: true },
    // Maiden Name will be disabled if Civil Status is Single.
    { label: "Maiden Name", name: "maiden_name", type: "text" },
    // Extension Name has an options property – render as dropdown.
    { label: "Extension Name", name: "extension_name", options: ["Jr", "Sr"] },
    // Civil Status has options – render as dropdown.
    { label: "Civil Status", name: "civil_status", options: ["Single", "Married", "Widowed", "Divorced"], required: true },
    { label: "Date of Birth", name: "date_of_birth", type: "date", required: true },
    { label: "Age", name: "age", type: "number", required: true },
    { label: "Birthplace Province", name: "birthplace_province", type: "text" },
    // Sex has options – render as dropdown.
    { label: "Sex", name: "sex", options: ["Male", "Female", "Other"], required: true },
    { label: "Religion", name: "religion", type: "text" },
    // Income field changes based on mode.
    mode === "loan"
      ? { label: "Monthly Income (PHP)", name: "monthly_income", type: "number" }
      : { label: "Annual Income (PHP)", name: "annual_income", type: "number" },
    { label: "TIN Number", name: "tin_number", type: "text" },
    { label: "Number of Dependents", name: "number_of_dependents", type: "number" },
    { label: "Name of Spouse", name: "spouse_name", type: "text" }
  ];

  // Define dropdown fields (common to both modes).
  const dropdowns = [
    { label: "Highest Educational Attainment", name: "highest_educational_attainment", options: ["Elementary", "High School", "College", "Post Graduate"] },
    { label: "Occupation Source Of Income", name: "occupation_source_of_income", options: ["Employed", "Self-Employed", "Business Owner", "Freelancer"] },
    { label: "Spouse Occupation Source Of Income", name: "spouse_occupation_source_of_income", options: ["Employed", "Self-Employed", "Business Owner", "Freelancer"] }
  ];

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Render member type and registration type only in registration mode */}
      {mode !== "loan" && (
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            Member Type <span className="text-red-500">*</span>
            <select
              className={`border p-3 rounded-lg w-full ${errors.member_type ? "border-red-500" : ""}`}
              name="member_type"
              value={personalInfo.member_type || ""}
              onChange={handleChange}
            >
              <option value="Regular member">Regular member</option>
            </select>
            {errors.member_type && <p className="text-red-500 text-sm">{errors.member_type}</p>}
          </label>
          <label className="block">
            Registration Type <span className="text-red-500">*</span>
            <select
              className={`border p-3 rounded-lg w-full ${errors.registration_type ? "border-red-500" : ""}`}
              name="registration_type"
              value={personalInfo.registration_type || ""}
              onChange={handleChange}
            >
              <option value="">Select Registration Type</option>
              <option value="New">New</option>
              <option value="Transfer">Transfer</option>
            </select>
            {errors.registration_type && (
              <p className="text-red-500 text-sm">{errors.registration_type}</p>
            )}
          </label>
        </div>
      )}

      {/* Render text input fields.
          If an input has an "options" property, render a select instead. */}
      {textInputs.map((input, index) => (
        <label key={index} className="block">
          {input.label} {input.required && <span className="text-red-500">*</span>}
          {input.options ? (
            <select
              name={input.name}
              value={personalInfo[input.name] || ""}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full ${errors[input.name] ? "border-red-500" : ""}`}
            >
              <option value="">Select {input.label}</option>
              {input.options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={`border p-3 rounded-lg w-full ${errors[input.name] ? "border-red-500" : ""}`}
              name={input.name}
              type={input.type}
              value={personalInfo[input.name] || ""}
              onChange={handleChange}
              placeholder={input.label}
              // Disable Maiden Name field if Civil Status is Single.
              disabled={input.name === "maiden_name" && personalInfo.civil_status === "Single"}
            />
          )}
          {errors[input.name] && (
            <p className="text-red-500 text-sm">{errors[input.name]}</p>
          )}
        </label>
      ))}

      {/* Render dropdown fields */}
      {dropdowns.map((select, index) => (
        <label key={index} className="block">
          {select.label} {select.required && <span className="text-red-500">*</span>}
          <select
            className={`border p-3 rounded-lg w-full ${errors[select.name] ? "border-red-500" : ""}`}
            name={select.name}
            value={personalInfo[select.name] || ""}
            onChange={handleChange}
          >
            <option value="">Select {select.label}</option>
            {select.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors[select.name] && (
            <p className="text-red-500 text-sm">{errors[select.name]}</p>
          )}
        </label>
      ))}

      {/* Next Button */}
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
