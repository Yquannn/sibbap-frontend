import React, { useState, useEffect } from "react";
import axios from "axios";

const AddAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [status, setStatus] = useState("New");
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState();

  // Fetch all announcements from the backend
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/announcement");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !targetAudience || !status) {
      alert("Please fill in all fields.");
      return;
    }

    const announcementData = {
      title,
      content,  
      targetAudience,
      status,
    };

    try {
      console.log("Submitting announcement data:", announcementData); // Log the data to check before sending

      let response;
      if (selectedAnnouncementId) {
        // Update existing announcement
        response = await axios.put(
          `http://localhost:3001/api/announcement/${selectedAnnouncementId}`, // Ensure this is the correct URL
          announcementData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        alert(response.data.message || "Announcement updated successfully!");
      } else {
        // Add new announcement
        response = await axios.post(
          "http://localhost:3001/api/announcement",
          announcementData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        alert(response.data.message || "Announcement added successfully!");
      }

      // Clear fields and reset state after successful operation
      setTitle("");
      setContent("");
      setTargetAudience("");
      setStatus("New");
      setSelectedAnnouncementId();
  
      // Fetch updated list of announcements
      fetchAnnouncements();
    } catch (error) {
      console.error("Error submitting announcement:", error.response?.data || error.message);
      alert("Failed to add or update announcement.");
    }
  };

  // Handle selecting an announcement to edit
  const handleEdit = (announcement) => {
    console.log("Editing announcement:", announcement); // Log to verify the structure of the announcement
    setSelectedAnnouncementId(announcement.announcementId);
    setTitle(announcement.title);
    setContent(announcement.content);
    setTargetAudience(announcement.targetAudience);
    setStatus(announcement.status);
  };

  // Fetch announcements when the component mounts
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="">
      
      <div className="flex flex-wrap md:flex-nowrap space-x-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {selectedAnnouncementId ? "Edit Announcement" : "Add New Announcement"}
          </h2>
          {selectedAnnouncementId && (
            <p className="mb-4 text-sm text-gray-600">
              <strong>Announcement ID:</strong> {selectedAnnouncementId}
            </p>
          )}

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., All Users, Premium Subscribers"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="New">New</option>
              <option value="Urgent">Urgent</option>
              <option value="Update">Update</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none"
          >
            {selectedAnnouncementId ? "Update Announcement" : "Add Announcement"}
          </button>
        </div>

        {/* Announcement List Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Existing Announcements</h2>
          <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg shadow-md">
            <ul className="space-y-6">
              {announcements.map((announcement) => (
                <li
                  key={announcement.announcementId} // Ensure this is the correct ID field
                  className="bg-gray-100 p-5 rounded-lg shadow-sm hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => handleEdit(announcement)}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600">{announcement.content}</p>
                  <p className="text-sm text-gray-500 mt-2">{`Target Audience: ${announcement.targetAudience}`}</p>
                  <p className="text-sm text-gray-500 mt-1">{`Status: ${announcement.status}`}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAnnouncement;
