import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack, IoSend, IoImageOutline } from "react-icons/io5";
import { BsArrowLeft } from "react-icons/bs";

const ChatApp = ({ socket }) => {
  const { friendId } = useParams();
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [friend, setFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user ID, friends, and friend details
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/Profile", {
          withCredentials: true,
        });
        setUserId(res.data._id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/friends", {
          withCredentials: true,
        });
        setFriends(res.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    const fetchFriend = async () => {
      if (friendId) {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/user/${friendId}`,
            {
              withCredentials: true,
            }
          );
          setFriend(res.data);
        } catch (error) {
          console.error("Error fetching friend:", error);
        }
      } else {
        setFriend(null); // Reset friend when no friendId
      }
    };

    fetchUserId();
    fetchFriends();
    fetchFriend();
  }, [friendId]);

  // Fetch messages when friendId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (friendId) {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/messages/${friendId}`,
            {
              withCredentials: true,
            }
          );
          setMessages(res.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      } else {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [friendId]);

  // Socket.io setup
  useEffect(() => {
    socket.on("connect", () => {
      // console.log('Socket connected:', socket.id);
      if (userId) {
        socket.emit("join", userId);
      }
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    if (userId && friendId) {
      const roomId = [userId, friendId].sort().join("-");
      socket.emit("joinRoom", roomId);

      socket.on("receiveMessage", (message) => {
        if (message.senderId !== userId) {
          setMessages((prev) => {
            if (prev.some((msg) => msg._id === message._id)) return prev;
            return [...prev, message];
          });
        }
      });
    }

    return () => {
      socket.off("connect");
      socket.off("onlineUsers");
      socket.off("connect_error");
      socket.off("receiveMessage");
    };
  }, [userId, friendId, socket]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) {
      setError("Please provide a message or select an image");
      return;
    }

    try {
      setError("");
      const formData = new FormData();
      formData.append("receiverId", friendId);
      if (newMessage) formData.append("content", newMessage);
      if (imageFile) formData.append("image", imageFile);
      console.log(formData);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await axios.post(
        "http://localhost:3000/api/messages",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res);
      const sentMessage = res.data;
      console.log(sentMessage);
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === sentMessage._id)) return prev;
        return [...prev, sentMessage];
      });
      const roomId = [userId, friendId].sort().join("-");
      socket.emit("sendMessage", { ...sentMessage, roomId });
      setNewMessage("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const filetypes = /jpeg|jpg|png/;
      if (!filetypes.test(file.type)) {
        setError("Only JPEG, JPG, or PNG images are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setError("");
      setImageFile(file);
    }
  };

  const handleBackClick = () => {
    navigate("/messages");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar: Friends List */}
      <div className="w-1/4 bg-white shadow-lg rounded-l-2xl p-4 flex flex-col">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-blue-500 font-semibold hover:text-blue-600 transition duration-200"
        >
          <BsArrowLeft size={24} /> Back
        </button>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Messages</h1>
        <div className="flex-1 overflow-y-auto">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <Link
                to={`/chat/${friend._id}`}
                key={friend._id}
                className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors duration-200 ${
                  friendId === friend._id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                <div className="relative">
                  <img
                    src={friend.image || "./Profile.png"}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {onlineUsers.includes(friend._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{friend.name}</h3>
                  <p className="text-sm text-gray-500">
                    {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No friends found.</p>
          )}
        </div>
      </div>

      {/* Right: Chat Body */}
      <div className="w-3/4 flex flex-col bg-white rounded-r-2xl shadow-lg">
        {friendId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
              <Link to="/chat" className="md:hidden">
                <IoArrowBack className="text-2xl text-gray-600" />
              </Link>
              {friend && (
                <div className="flex items-center gap-3">
                  <img
                    src={friend.image || "./Profile.png"}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <h1 className="text-xl font-semibold text-gray-800">
                    {friend.name}
                  </h1>
                </div>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`mb-4 flex ${
                      msg.senderId === friendId
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md p-3 rounded-2xl shadow ${
                        msg.senderId === friendId
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {msg.content && <p>{msg.content}</p>}
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Chat image"
                          className="max-w-full h-auto rounded-lg mt-2"
                          onError={(e) => (e.target.src = "./Profile.png")}
                        />
                      )}
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No messages yet.</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-50">
              {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <label className="p-3 cursor-pointer text-gray-600 hover:text-blue-500">
                  <IoImageOutline className="text-2xl" />
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
                <button
                  type="submit"
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <IoSend className="text-xl" />
                </button>
              </form>
              {imageFile && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="max-w-xs h-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600">
                Chat with Friends
              </h2>
              <p className="text-gray-500 mt-2">
                Select a friend to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
