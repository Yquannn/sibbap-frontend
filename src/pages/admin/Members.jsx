import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaEye, FaUsers, FaArrowDown, FaArrowUp, FaUserTie } from 'react-icons/fa';
import MemberProfileModal from '../../components/modal/MemberProfileModal';
import AddMemberModal from '../../components/modal/AddMemberModal';
import { UserPlus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { MdPeople, MdCheckCircle, MdRemoveCircleOutline, MdAttachMoney } from 'react-icons/md';

const apiBaseURL = 'http://localhost:3001/api';

const Members = () => {
  const [modalState, setModalState] = useState({
    addOpen: false,
    editOpen: false,
    viewOpen: false,
    selectedMember: null
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMemberType, setFilterMemberType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [totalMember, setTotalMember] = useState(0);

  const navigate = useNavigate();

  // Function to generate image URL if available
  const imageUrl = (filename) =>
    filename ? `http://localhost:3001/uploads/${filename}` : "";

  // Define an array of background color classes
  const bgColors = [
    "bg-red-500", "bg-blue-500", "bg-green-500",
    "bg-yellow-500", "bg-purple-500", "bg-indigo-500",
    "bg-pink-500", "bg-orange-500"
  ];

  // Helper to compute a consistent background color based on the member's unique id
  const getMemberFallbackColor = (member) => {
    const id = member.memberId ? String(member.memberId) : `${member.first_name || ''}${member.last_name || ''}`;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % bgColors.length;
    return bgColors[index];
  };

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.name = searchTerm;
      if (filterMemberType !== "All") params.member_type = filterMemberType;
      if (filterStatus !== "All") params.status = filterStatus;
      const response = await axios.get(`${apiBaseURL}/members`, { params });
      // Sort members by memberCode (or id) in descending order
      const sortedMembers = response.data.sort(
        (a, b) => parseInt(b.memberCode) - parseInt(a.memberCode)
      );
      setMembers(sortedMembers);
    } catch (err) {
      setError('Error fetching members: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterMemberType, filterStatus]);

  const FetchTotalMember = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}/total`);
      setTotalMember(response.data.totalMembers);
    } catch (error) {
      console.error('Error fetching total members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
    FetchTotalMember();
  }, [fetchMembers]);

  const openModal = (type, member = null) => {
    setModalState({
      addOpen: type === 'addOpen',
      editOpen: type === 'editOpen',
      viewOpen: type === 'viewOpen',
      selectedMember: member
    });
  };

  const closeModal = () => {
    setModalState({
      addOpen: false,
      editOpen: false,
      viewOpen: false,
      selectedMember: null
    });
  };

  const updateMember = async (member) => {
    try {
      setLoading(true);
      await axios.put(
        `${apiBaseURL}/members/${member.memberId}`,
        member,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage({ type: "success", text: "Member updated successfully!" });
      fetchMembers();
      closeModal();
    } catch (error) {
      setMessage({ type: "error", text: "Error updating member: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (member) => {
    if (modalState.editOpen) {
      await updateMember(member);
    }
    fetchMembers();
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        setLoading(true);
        await axios.delete(`${apiBaseURL}/members/${memberId}`);
        setMembers((prev) => prev.filter((member) => member.memberId !== memberId));
        setMessage({ type: 'success', text: "Member deleted successfully!" });
        fetchMembers();
      } catch (error) {
        setMessage({ type: 'error', text: 'Error deleting member: ' + error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white  text-black">
          <div className="card-body flex items-center">
            <MdPeople className="text-5xl mr-4 text-green-600" />
            <div>
              <h2 className="card-title text-sm">Total Members</h2>
              <p className="text-xl font-bold">{totalMember.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white  text-black">
          <div className="card-body flex items-center">
            <MdCheckCircle className="text-5xl mr-4 text-blue-600" />
            <div>
              <h2 className="card-title text-sm">Active Members</h2>
              <p className="text-xl font-bold">25,000</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white text-black">
          <div className="card-body flex items-center">
            <MdRemoveCircleOutline className="text-5xl mr-4 text-red-600" />
            <div>
              <h2 className="card-title text-sm">Inactive Members</h2>
              <p className="text-xl font-bold">15,000</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white text-black">
          <div className="card-body flex items-center">
            <MdAttachMoney className="text-5xl mr-4 text-purple-600" />
            <div>
              <h2 className="card-title text-sm">Membership Fee</h2>
              <p className="text-xl font-bold">Php350</p>
            </div>
          </div>
        </div>
      </div>


      {/* Search & Filter Bar with Add Member Button */}
      <div className="flex flex-col sm:flex-row justify-end items-center bg-white p-4 rounded-lg mb-6 gap-4 mt-4">
        {message.text && (
          <div className={`font-medium mr-auto ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </div>
        )}
        <div className="flex items-center gap-4">
          <select
            className="select select-bordered"
            value={filterMemberType}
            onChange={(e) => setFilterMemberType(e.target.value)}
          >
            <option>All</option>
            <option>New</option>
            <option>Transfer</option>
          </select>
          <select
            className="select select-bordered"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search member..."
            className="input input-bordered w-full sm:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={() => navigate("/register-member")}
          >
            <UserPlus className="mr-2" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Members Table with vertical scrolling */}
      <div className="overflow-y-auto max-h-[60vh] card bg-white shadow-md rounded-lg p-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-12">
                <input type="checkbox" className="checkbox" />
              </th>
              <th>Code Number</th>
              <th>Name</th>
              <th>Member Type</th>
              <th>Date of Birth</th>
              <th>Civil Status</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Shared Capital</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={`${member.memberId}-${index}`} className="hover">
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>{member.memberCode}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        {imageUrl(member.id_picture) ? (
                          <img
                            src={imageUrl(member.id_picture)}
                            alt="Avatar"
                          />
                        ) : (
                          <div className={`flex items-center justify-center h-full w-full ${getMemberFallbackColor(member)}`}>
                            <span className="text-lg font-bold text-white">
                              {`${member.first_name?.charAt(0) || ''}${member.last_name?.charAt(0) || ''}`.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {member.last_name} {member.first_name}
                      </div>
                      <div className="text-sm opacity-50">{member.country || ""}</div>
                    </div>
                  </div>
                </td>
                <td>{member.member_type}</td>
                <td>
                  {new Date(member.date_of_birth).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </td>
                <td>{member.civil_status}</td>
                <td>{member.contact_number}</td>
                <td>{member.barangay}</td>
                <td>{member.share_capital}</td>
                <td>
                  <span className={`badge ${(!member.status || member.status.toLowerCase() === "active") ? 'badge-success' : 'badge-error'}`}>
                    {member.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-gray" 
                    onClick={() => navigate(`/member-profile/${member.memberId}`)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {(modalState.addOpen || modalState.editOpen) && (
        <AddMemberModal
          isOpen={modalState.addOpen || modalState.editOpen}
          onClose={closeModal}
          onSave={handleSave}
          memberIdToEdit={modalState.editOpen ? modalState.selectedMember.memberId : null}
        />
      )}
      {modalState.viewOpen && (
        <MemberProfileModal
          isOpen={modalState.viewOpen}
          onClose={closeModal}
          member={modalState.selectedMember}
        />
      )}
    </div>
  );
};

export default Members;
