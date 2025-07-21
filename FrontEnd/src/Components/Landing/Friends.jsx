import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://social-nest-2.onrender.com/api/auth/friends",
          {
            withCredentials: true,
          }
        );

        const data = res.data;
        const validUsers = data.filter(
          (user) => user._id && user._id !== "undefined"
        );
        setUsers(validUsers);
        setFilteredUsers(validUsers);

        const profileRes = await axios.get(
          "https://social-nest-2.onrender.com/api/user/user",
          {
            withCredentials: true,
          }
        );
        const followingList = profileRes.data.following || [];
        const followStatus = {};
        validUsers.forEach((user) => {
          followStatus[user._id] = followingList.includes(user._id);
        });
        setFollowing(followStatus);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleFollow = async (userId) => {
    try {
      await axios.post(
        `https://social-nest-2.onrender.com/api/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      setFollowing((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.log("Error following user:", error);
    }
  };

  const handleUnFollow = async (userId) => {
    try {
      await axios.post(
        `https://social-nest-2.onrender.com/api/user/unfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      setFollowing((prev) => ({ ...prev, [userId]: false }));
    } catch (error) {
      console.log("Error unfollowing user:", error);
    }
  };

  const handleUserClick = (userId) => {
    if (userId && userId !== "undefined") {
      navigate(`/profile/${userId}`);
    } else {
      console.error("Invalid userId:", userId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Your Friends
        </h2>
      </div>

      {/* Search Bar */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <FiSearch className="text-gray-500" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full pl-12 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="max-w-5xl mx-auto p-4">
        {loading ? (
          <div className="text-center p-4">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No friends found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            {filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className={`flex items-center justify-between p-4 ${
                  index !== filteredUsers.length - 1
                    ? "border-b border-gray-200"
                    : ""
                } hover:bg-gray-50 transition duration-200`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.image || "/Profile.png"}
                    alt=""
                    className="w-12 h-12 rounded-full cursor-pointer object-cover"
                    onClick={() => handleUserClick(user._id)}
                  />
                  <div>
                    <h3
                      className="font-semibold text-gray-800 text-[16px] cursor-pointer hover:underline"
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() =>
                    following[user._id]
                      ? handleUnFollow(user._id)
                      : handleFollow(user._id)
                  }
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition duration-200 ${
                    following[user._id]
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "border border-blue-500 text-blue-500 hover:bg-blue-50"
                  }`}
                >
                  {following[user._id] ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;

