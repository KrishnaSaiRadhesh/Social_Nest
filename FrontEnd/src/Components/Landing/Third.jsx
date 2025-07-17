import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Third = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const profileRes = await api.get("/auth/user");
        const currentUserData = profileRes.data;
        setCurrentUserId(currentUserData._id);
        const followingList = currentUserData.following || [];

        const res = await api.get("/auth/suggested");
        const data = res.data;

        const validUsers = data.filter(
          (user) =>
            user._id && user._id !== "undefined" && user._id !== currentUserData._id
        );

        setUsers(
          validUsers.map((user) => ({
            ...user,
            image: user.image || user.googleImage || "/Profile.png",
          }))
        );
        
        setFilteredUsers(
          validUsers.map((user) => ({
            ...user,
            image: user.image || user.googleImage || "/Profile.png",
          }))
        );

        const followStatus = {};
        validUsers.forEach((user) => {
          followStatus[user._id] = followingList.includes(user._id);
        });
        setFollowing(followStatus);
      } catch (error) {
        console.error("Error fetching users:", error);
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
      await api.post(`/user/follow/${userId}`);
      setFollowing((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnFollow = async (userId) => {
    try {
      await api.post(`/user/unfollow/${userId}`);
      setFollowing((prev) => ({ ...prev, [userId]: false }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleUserClick = (userId) => {
    if (userId && userId !== "undefined") {
      navigate(`/profile/${userId}`);
    } else {
      console.error("Invalid userId:", userId);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 sm:p-4">
        <div className="h-6 bg-gray-300 rounded animate-pulse w-1/3 mb-4"></div>
        <div className="bg-gray-100 h-12 rounded-2xl animate-pulse mb-4"></div>
        <div className="space-y-3">
          <div className="flex justify-between animate-pulse">
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex justify-between animate-pulse">
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-base sm:text-lg font-medium">Suggested for you</h2>
      </div>

      <div className="bg-gray-100 flex justify-between items-center mt-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <FiSearch className="text-base sm:text-lg" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none bg-gray-100 text-sm sm:text-base w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <IoFilterSharp className="text-base sm:text-lg" />
      </div>

      <div className="mt-4 sm:mt-5">
        {filteredUsers.length === 0 ? (
          <p className="text-sm sm:text-base text-center">
            No valid users found
          </p>
        ) : (
          <div className="flex flex-col items-left gap-4 sm:gap-5">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={user.image || "/Profile.png"}
                    alt=""
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full cursor-pointer"
                    onClick={() => handleUserClick(user._id)}
                  />
                  <h3
                    className="font-semibold text-sm sm:text-base cursor-pointer"
                    onClick={() => handleUserClick(user._id)}
                  >
                    {user.name}
                  </h3>
                </div>
                <button
                  className={`px-2 sm:px-3 py-1 rounded text-white text-sm sm:text-base ${
                    following[user._id] ? "bg-red-500" : "bg-blue-500"
                  }`}
                  onClick={() =>
                    following[user._id]
                      ? handleUnFollow(user._id)
                      : handleFollow(user._id)
                  }
                >
                  {following[user._id] ? "Unfollow" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Third;