import React from "react";
import { X, Check } from "lucide-react";

/**
 * A success modal styled like the provided screenshot:
 * - Large green circle with a white check icon
 * - "Success" heading
 * - Descriptive text
 * - OK button
 */
const SuccessModal = ({
  title = "Success",
  message = "Check your email for a booking confirmation. We’ll see you soon!",
  onClose,
}) => {
  return (
    <div
      className="modal modal-open flex items-center justify-center"
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="modal-box relative w-80">
        {/* Close button in top-right corner */}
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        {/* Content Container */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4 pb-2">
          {/* Big green circle with white check icon */}
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={28} className="text-white" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold">{title}</h2>

          {/* Subtext */}
          <p className="text-sm text-gray-500 px-2">{message}</p>

          {/* OK button */}
          <button className="btn btn-success w-full" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
