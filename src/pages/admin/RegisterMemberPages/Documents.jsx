import React from "react";

const Documents = ({ handleNext, handlePrevious, formData, setFormData }) => {
  // Default structure for documents
  const defaultDocuments = {
    id_picture: null,
    barangay_clearance: null,
    tax_identification: null,
    valid_id: null,
    membership_agreement: null,
  };

  // Merge parent's documents with defaults so that all keys exist.
  const documents = {
    ...defaultDocuments,
    ...formData.documents,
  };

  // Handler for file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    // Store only the first selected file
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...documents,
        [name]: files[0],
      },
    }));
  };

  // Handler to remove a file from the state
  const handleRemove = (name) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...documents,
        [name]: null,
      },
    }));
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-white w-full max-w-3xl p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          DOCUMENTS UPLOAD
        </h2>

        {/* File Upload Section */}
        <div className="grid grid-cols-1 gap-4">
          {/* Profile Picture (backend field: id_picture) */}
          <div className="grid grid-cols-2 items-center gap-4">
            <label>Profile Picture:</label>
            <div>
              <input
                type="file"
                name="id_picture"
                className="border p-2 rounded-lg w-full"
                onChange={handleFileChange}
              />
              {documents.id_picture && (
                <div className="mt-1">
                  <p className="text-sm text-gray-700">
                    Uploaded: {documents.id_picture.name}
                  </p>
                  <button
                    className="text-red-500 text-sm mt-1"
                    onClick={() => handleRemove("id_picture")}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Barangay Clearance */}
          <div className="grid grid-cols-2 items-center gap-4">
            <label>Barangay Clearance:</label>
            <div>
              <input
                type="file"
                name="barangay_clearance"
                className="border p-2 rounded-lg w-full"
                onChange={handleFileChange}
              />
              {documents.barangay_clearance && (
                <div className="mt-1">
                  <p className="text-sm text-gray-700">
                    Uploaded: {documents.barangay_clearance.name}
                  </p>
                  <button
                    className="text-red-500 text-sm mt-1"
                    onClick={() => handleRemove("barangay_clearance")}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tax Identification */}
          <div className="grid grid-cols-2 items-center gap-4">
            <label>Tax Identification:</label>
            <div>
              <input
                type="file"
                name="tax_identification"
                className="border p-2 rounded-lg w-full"
                onChange={handleFileChange}
              />
              {documents.tax_identification && (
                <div className="mt-1">
                  <p className="text-sm text-gray-700">
                    Uploaded: {documents.tax_identification.name}
                  </p>
                  <button
                    className="text-red-500 text-sm mt-1"
                    onClick={() => handleRemove("tax_identification")}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Valid ID */}
          <div className="grid grid-cols-2 items-center gap-4">
            <label>Valid ID:</label>
            <div>
              <input
                type="file"
                name="valid_id"
                className="border p-2 rounded-lg w-full"
                onChange={handleFileChange}
              />
              {documents.valid_id && (
                <div className="mt-1">
                  <p className="text-sm text-gray-700">
                    Uploaded: {documents.valid_id.name}
                  </p>
                  <button
                    className="text-red-500 text-sm mt-1"
                    onClick={() => handleRemove("valid_id")}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Membership Agreement */}
          <div className="grid grid-cols-2 items-center gap-4">
            <label>Membership Agreement:</label>
            <div>
              <input
                type="file"
                name="membership_agreement"
                className="border p-2 rounded-lg w-full"
                onChange={handleFileChange}
              />
              {documents.membership_agreement && (
                <div className="mt-1">
                  <p className="text-sm text-gray-700">
                    Uploaded: {documents.membership_agreement.name}
                  </p>
                  <button
                    className="text-red-500 text-sm mt-1"
                    onClick={() => handleRemove("membership_agreement")}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-red-700 text-white text-lg px-6 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-red-700 transition-all mr-6"
            onClick={handlePrevious}
            type="button"
          >
            <span className="text-2xl">&#171;&#171;</span> Previous
          </button>

          <button
            className="bg-green-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-800 transition-all"
            onClick={handleNext}
            type="button"
          >
            <span className="text-2xl">&#187;&#187;</span> Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documents;
