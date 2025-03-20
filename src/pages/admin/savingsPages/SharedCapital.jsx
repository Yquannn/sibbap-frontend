import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const ShareCapital = ({ members, openModal, handleDelete }) => {
  return (
    <div className="p-0">
      <h4 className="text-xl font-bold mb-4">Share Capital</h4>
      <div className="overflow-y-auto max-h-[60vh] card bg-white shadow-md rounded-lg p-4">
        <table className="table w-full">
          <thead className="text-center">
            <tr>
              {["Member Code", "Last Name", "First Name", "Contact Number", "Address", "Shared Capital", "Actions"].map((heading) => (
                <th key={heading} className="py-3 px-4 border-b border-gray-300">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members && members.length > 0 ? (
              members.map((member, index) => (
                <tr
                  key={`${member.id}-${index}`}
                  className="text-center hover:bg-gray-100 cursor-pointer"
                >
                  <td className="py-3 px-4 border-b border-gray-300">{member.memberCode}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{member.lastName}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{member.firstName}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{member.contactNumber}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{member.address}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{member.shareCapital}</td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => openModal("editOpen", member)}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center"
                      >
                        <FaEdit className="mr-1" /> Update
                      </button>
                      <button
                        onClick={() => handleDelete(member.memberId)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                      <button
                        onClick={() => openModal("viewOpen", member)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShareCapital;
