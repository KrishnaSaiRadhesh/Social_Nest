import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Third = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null); // Store logged-in user's ID
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        // Fetch current user's profile to get their ID and following list
        const profileRes = await axios.get(
          "https://social-nest-backend.onrender.com/api/user/profile",
          {
            withCredentials: true,
          }
        );
        const currentUserData = profileRes.data;
        setCurrentUserId(currentUserData._id); // Store logged-in user's ID
        const followingList = currentUserData.following || [];

        // Fetch suggested users
        const res = await axios.get(
          "https://social-nest-backend.onrender.com/api/auth/suggested",
          {
            withCredentials: true,
          }
        );
        const data = res.data;

        // Filter out users with invalid or missing _id and exclude the logged-in user
        const validUsers = data.filter(
          (user) =>
            user._id &&
            user._id !== "undefined" &&
            user._id !== currentUserData._id
        );

        setUsers(validUsers);
        setFilteredUsers(validUsers);

        // Set follow status for each user
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
        `https://social-nest-backend.onrender.com/api/user/follow/${userId}`,
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
        `https://social-nest-backend.onrender.com/api/user/unfollow/${userId}`,
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
    <div className="p-4 h-screen bg-white shadow-lg hidden lg:block ">
      <div className="p-3 flex items-center gap-3 justify-between w-full mt-1">
        <h2 className="text-lg font-medium">Suggested for you</h2>
      </div>

      <div className="bg-gray-100 flex justify-between items-center mt-1 gap-1 p-3 rounded-2xl">
        <div className="flex items-center gap-5">
          <FiSearch />
          <input
            type="text"
            placeholder="Search"
            className="outline-none bg-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <IoFilterSharp />
      </div>

      <div className="mt-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col items-left gap-5 mt-5">
            {filteredUsers.length === 0 ? (
              <p>No valid users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-5 px-5"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={user.image || "/Profile.png"}
                      alt=""
                      className="w-10 h-10 rounded-full cursor-pointer"
                      onClick={() => handleUserClick(user._id)}
                    />
                    <h3
                      className="font-semibold text-[15px] cursor-pointer"
                      onClick={() => handleUserClick(user._id)}
                    >
                      {user.name}
                    </h3>
                  </div>
                  <button
                    className={`p-2 rounded text-white ${
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Third;
