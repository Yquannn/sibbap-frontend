// import React, { useEffect, useState } from "react";
// import { FaEye, FaSearch } from "react-icons/fa";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const RegularSavings = ({ openModal, handleDelete }) => {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterQuery, setFilterQuery] = useState("");
//   const navigate = useNavigate();

//   // Fetch data from the backend
//   useEffect(() => {
//     const fetchSavings = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/api/members/savings");
//         setMembers(response.data.data);
//       } catch (error) {
//         console.error("Error fetching member savings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSavings();
//   }, []);

//   // Filtering logic: filter members based on the filterQuery
//   const filteredMembers = members.filter((member) => {
//     const query = filterQuery.toLowerCase();
//     const fullName = member.fullName ? member.fullName.toLowerCase() : "";
//     const code = member.memberCode ? member.memberCode.toLowerCase() : "";
//     return query === "" || fullName.includes(query) || code.includes(query);
//   });

//   if (loading) {
//     return <div className="p-6 text-center">Loading...</div>;
//   }

//   return (
//     <div className="">
//       {/* Header with Total Members & Search Input */}
//       <div className="card bg-base-200 rounded-lg mb-6 p-4">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//           <h4 className="text-xl font-bold">
//             Regular Savings Members - {members.length}
//           </h4>
//           <div className="w-full md:w-1/3">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by name, code..."
//                 value={filterQuery}
//                 onChange={(e) => setFilterQuery(e.target.value)}
//                 className="input input-bordered w-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
//               />
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Savings Table with vertical scrolling */}
//       <div className="overflow-y-auto max-h-[60vh]">
//         <table className="table w-full">
//           <thead className="text-center">
//             <tr>
//               <th>
//               </th>
//               {[
//                 "Code Number",
//                 "Account No.",
//                 "Full Name",
//                 "Date of birth",
//                 "Age",
//                 "Contact Number",
//                 "Balance",
//                 "Account Status",
//                 "Actions"
//               ].map((heading) => (
//                 <th key={heading} className="py-3 px-4 border-b border-gray-300">
//                   {heading}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredMembers.length > 0 ? (
//               filteredMembers.map((member, index) => (
//                 <tr
//                   key={index}
//                   className="text-center hover:bg-gray-100 cursor-pointer"
//                 >
//                   <th>
//                     <label>
//                       <input type="checkbox" className="checkbox" />
//                     </label>
//                   </th>
//                   <td className="py-3 px-4 border-b border-gray-300">
//                     {member.memberCode}
//                   </td>
//                   <td className="py-3 px-4 border-b border-gray-300">
//                     {member.memberCode}
//                   </td>
//                   <td className="py-3 px-4 border-b border-gray-300">
//                     {member.fullName}
//                   </td>
//                   <td className="py-3 px-4 border-b border-gray-300">
//                     {new Date(member.date_of_birth).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric"
//                     })}
//                   </td>
//                   <td className="py-3 px-4 border-b border-gray-300">
//                     {member.age}
//                   </td>
//                   <td className="py-3 px-4 border-b border-gray-300">
//                     {member.contact_number}
//                   </td>
//                   <td className="py-3 px-4 border-b border-gray-300">
//                     {member.savingsAmount}
//                   </td>
//                   <td className="py-3 px-4 border-b border-gray-300 text-center">
//                     <span className="badge badge-sm bg-green-100 text-green-700">
//                       {member.savingsStatus || "Active"}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 border-b border-gray-300">
//                     <div className="flex justify-center">
//                       <button
//                         onClick={() =>
//                           navigate(`/regular-savings-info/${member.memberId}`)
//                         }
//                         className="btn btn-success btn-sm flex items-center"
//                       >
//                         <FaEye className="mr-1" /> View
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={9} className="py-4 text-center">
//                   No savings data found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//           {/* <tfoot className="">
//             <tr>
//               <th></th>
//               <th>Code Number</th>
//               <th>Account No.</th>
//               <th>Full Name</th>
//               <th>Date of birth</th>
//               <th>Age</th>
//               <th>Contact Number</th>
//               <th>Balance</th>
//               <th>Account Status</th>
//               <th>Actions</th>
//             </tr>
//           </tfoot> */}
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RegularSavings;

import React, { useEffect, useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegularSavings = ({ openModal, handleDelete }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const navigate = useNavigate();

  // Fetch data from the backend
  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/members/savings");
        setMembers(response.data.data);
      } catch (error) {
        console.error("Error fetching member savings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();
  }, []);

  // Filtering logic: filter members based on the filterQuery
  const filteredMembers = members.filter((member) => {
    const query = filterQuery.toLowerCase();
    const fullName = member.fullName ? member.fullName.toLowerCase() : "";
    const code = member.memberCode ? member.memberCode.toLowerCase() : "";
    return query === "" || fullName.includes(query) || code.includes(query);
  });

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="">
      {/* Header with Total Members & Search Input */}
      <div className="card bg-white shadow-md rounded-lg mb-6 p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h4 className="text-xl font-bold">
            Regular Savings Members - {members.length}
          </h4>
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, code..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="input input-bordered w-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Table with vertical scrolling */}
      <div className="overflow-y-auto max-h-[75vh] card bg-white shadow-md rounded-lg p-4">
        <table className="table w-full">
          <thead className="text-center">
            <tr>
              <th className="w-12">
                <input type="checkbox" className="checkbox" />
              </th>
              {[
                "Code Number",
                "Account No.",
                "Full Name",
                "Date of birth",
                "Age",
                "Contact Number",
                "Balance",
                "Account Status",
                "Actions"
              ].map((heading) => (
                <th key={heading} className="py-3 px-4 border-b border-gray-300">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <tr
                  key={index}
                  className="text-center hover:bg-gray-100 cursor-pointer"
                >
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {member.memberCode}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {member.memberCode}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {member.fullName}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {new Date(member.date_of_birth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {member.age}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {member.contact_number}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {member.savingsAmount}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    <span className="badge badge-sm bg-green-100 text-green-700">
                      {member.savingsStatus || "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          navigate(`/regular-savings-info/${member.memberId}`)
                        }
                        className="btn btn-success btn-sm flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-4 text-center">
                  No savings data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegularSavings;
