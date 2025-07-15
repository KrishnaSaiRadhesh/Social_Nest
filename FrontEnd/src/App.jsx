// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import Signup from './Components/Signup';
// import Login from './Components/Login';
// import Profile from './Components/Profile/Profile';
// import UpdateProfile from './Components/Profile/UpdateProfile';
// import CreatePost from './Components/Posts/CreatePost';
// import UserProfile from './Components/Profile/UserProfile';
// import First from './Components/Landing/First';
// import Messages from './Components/Chat/Messages';
// import Chat from './Components/Chat/Chat';
// import io from 'socket.io-client';
// import LandingPage from './Pages/LandingPage';
// import Friends from './Components/Landing/Friends';

// // Use port 5000 to match your original backend
// const socket = io('https://social-nest-2.onrender.com', { withCredentials: true });

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/home" element={<LandingPage />} /> {/* First as homepage */}
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/profile/:id" element={<UserProfile />} />
//         <Route path="/UpdateProfile" element={<UpdateProfile />} />
//         <Route path="/CreatePost" element={<CreatePost />} />
//         <Route path="/messages" element={<Messages socket={socket} />} />
//         <Route path="/chat/:friendId" element={<Chat socket={socket} />} />
//         <Route path='/friends' element= {<Friends/>}/>
//       </Routes>
//     </div>
//   );
// };

// export default App;

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Signup from "./Components/Signup";
// import Login from "./Components/Login";
// import LandingPage from "./Pages/LandingPage";
// import Profile from "./Components/Profile/Profile";
// import UpdateProfile from "./Components/Profile/UpdateProfile";
// import CreatePost from "./Components/Posts/CreatePost";
// import UserProfile from "./Components/Profile/UserProfile";
// import Messages from "./Components/Chat/Messages";
// import Chat from "./Components/Chat/Chat";
// import io from "socket.io-client";
// import SavedPost from "./Components/Landing/SavedPost";

// const socket = io("https://social-nest-2.onrender.com", {
//   withCredentials: true,
// });

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/home/*" element={<LandingPage socket={socket} />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/profile/:id" element={<UserProfile />} />
//         <Route path="/UpdateProfile" element={<UpdateProfile />} />
//         <Route path="/CreatePost" element={<CreatePost />} />
//         <Route path="/messages" element={<Messages socket={socket} />} />
//         <Route path="/chat/:friendId" element={<Chat socket={socket} />} />
//         <Route path="/saved" element={<SavedPost />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Signup from "./Components/Signup";
// import Login from "./Components/Login";
// import LandingPage from "./Pages/LandingPage";
// import Profile from "./Components/Profile/Profile";
// import UpdateProfile from "./Components/Profile/UpdateProfile";
// import CreatePost from "./Components/Posts/CreatePost";
// import UserProfile from "./Components/Profile/UserProfile";
// import Messages from "./Components/Chat/Messages";
// import Chat from "./Components/Chat/Chat";
// import SavedPost from "./Components/Landing/SavedPost";
// import io from "socket.io-client";

// const socket = io("https://social-nest-2.onrender.com", {
//   withCredentials: true,
// });

// const GoogleLogin = () => {
//   const handleGoogleLogin = () => {
//     window.location.href = "https://social-nest-2.onrender.com/auth/google";
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <button
//         onClick={handleGoogleLogin}
//         className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
//       >
//         Login with Google
//       </button>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const [user, setUser] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch(
//           "https://social-nest-2.onrender.com/api/user",
//           {
//             credentials: "include",
//           }
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setUser(data);
//         } else {
//           window.location.href = "/";
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         window.location.href = "/";
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch("https://social-nest-2.onrender.com/auth/logout", {
//         credentials: "include",
//       });
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   if (loading) {
//     return <p className="text-center">Loading...</p>;
//   }

//   return (
//     <div className="flex flex-col items-center p-6">
//       {user ? (
//         <>
//           <h1 className="text-2xl font-bold mb-4">
//             Welcome, {user.displayName}!
//           </h1>
//           <p className="text-lg mb-4">Email: {user.email}</p>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </>
//       ) : (
//         <p className="text-center">No user data available</p>
//       )}
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/home/*" element={<LandingPage socket={socket} />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/profile/:id" element={<UserProfile />} />
//         <Route path="/UpdateProfile" element={<UpdateProfile />} />
//         <Route path="/CreatePost" element={<CreatePost />} />
//         <Route path="/messages" element={<Messages socket={socket} />} />
//         <Route path="/chat/:friendId" element={<Chat socket={socket} />} />
//         <Route path="/saved" element={<SavedPost />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Signup from "./Components/Signup";
// import Login from "./Components/Login";
// import LandingPage from "./Pages/LandingPage";
// import Profile from "./Components/Profile/Profile";
// import UpdateProfile from "./Components/Profile/UpdateProfile";
// import CreatePost from "./Components/Posts/CreatePost";
// import UserProfile from "./Components/Profile/UserProfile";
// import Messages from "./Components/Chat/Messages";
// import Chat from "./Components/Chat/Chat";
// import SavedPost from "./Components/Landing/SavedPost";
// import io from "socket.io-client";

// const socket = io("https://social-nest-2.onrender.com", {
//   withCredentials: true,
// });

// const GoogleLogin = () => {
//   const handleGoogleLogin = () => {
//     window.location.href = "https://social-nest-2.onrender.com/auth/google";
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <button
//         onClick={handleGoogleLogin}
//         className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
//       >
//         Login with Google
//       </button>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const [user, setUser] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch(
//           "https://social-nest-2.onrender.com/api/user",
//           {
//             credentials: "include",
//           }
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setUser(data);
//         } else {
//           window.location.href = "/";
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         window.location.href = "/";
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch("https://social-nest-2.onrender.com/auth/logout", {
//         credentials: "include",
//       });
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   if (loading) {
//     return <p className="text-center">Loading...</p>;
//   }

//   return (
//     <div className="flex flex-col items-center p-6">
//       {user ? (
//         <>
//           <h1 className="text-2xl font-bold mb-4">
//             Welcome, {user.displayName}!
//           </h1>
//           <p className="text-lg mb-4">Email: {user.email}</p>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </>
//       ) : (
//         <p className="text-center">No user data available</p>
//       )}
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/home/*" element={<LandingPage socket={socket} />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/profile/:id" element={<UserProfile />} />
//         <Route path="/UpdateProfile" element={<UpdateProfile />} />
//         <Route path="/CreatePost" element={<CreatePost />} />
//         <Route path="/messages" element={<Messages socket={socket} />} />
//         <Route path="/chat" element={<Chat socket={socket} />} />
//         <Route path="/chat/:friendId" element={<Chat socket={socket} />} />
//         <Route path="/saved" element={<SavedPost />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;



// modified

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Signup from "./Components/Signup";
// import Login from "./Components/Login";
// import LandingPage from "./Pages/LandingPage";
// import Profile from "./Components/Profile/Profile";
// import UpdateProfile from "./Components/Profile/UpdateProfile";
// import CreatePost from "./Components/Posts/CreatePost";
// import UserProfile from "./Components/Profile/UserProfile";
// import Messages from "./Components/Chat/Messages";
// import Chat from "./Components/Chat/Chat";
// import SavedPost from "./Components/Landing/SavedPost";
// import GoogleCallback from "./Components/GoogleCallback"; // New import
// import io from "socket.io-client";

// const socket = io("https://social-nest-2.onrender.com", {
//   withCredentials: true,
// });

// const Dashboard = () => {
//   const [user, setUser] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           "https://social-nest-2.onrender.com/api/user",
//           {
//             credentials: "include",
//             headers: token ? { Authorization: `Bearer ${token}` } : {},
//           }
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setUser(data);
//         } else {
//           window.location.href = "/login";
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         window.location.href = "/login";
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch("https://social-nest-2.onrender.com/auth/logout", {
//         credentials: "include",
//       });
//       localStorage.removeItem("token"); // Clear token on logout
//       window.location.href = "/login";
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   if (loading) {
//     return <p className="text-center">Loading...</p>;
//   }

//   return (
//     <div className="flex flex-col items-center p-6">
//       {user ? (
//         <>
//           <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
//           <p className="text-lg mb-4">Email: {user.email}</p>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </>
//       ) : (
//         <p className="text-center">No user data available</p>
//       )}
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/home/*" element={<LandingPage socket={socket} />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/profile/:id" element={<UserProfile />} />
//         <Route path="/UpdateProfile" element={<UpdateProfile />} />
//         <Route path="/CreatePost" element={<CreatePost />} />
//         <Route path="/messages" element={<Messages socket={socket} />} />
//         <Route path="/chat" element={<Chat socket={socket} />} />
//         <Route path="/chat/:friendId" element={<Chat socket={socket} />} />
//         <Route path="/saved" element={<SavedPost />} />
//         <Route path="/auth/google/callback" element={<GoogleCallback />} />{" "}
//         {/* New route */}
//       </Routes>
//     </div>
//   );
// };

// export default App;



import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import LandingPage from "./Pages/LandingPage";
import Profile from "./Components/Profile/Profile";
import UpdateProfile from "./Components/Profile/UpdateProfile";
import CreatePost from "./Components/Posts/CreatePost";
import UserProfile from "./Components/Profile/UserProfile";
import Messages from "./Components/Chat/Messages";
import Chat from "./Components/Chat/Chat";
import SavedPost from "./Components/Landing/SavedPost";
import api from "./api"; // Import the centralized API instance
import io from "socket.io-client";

const socket = io("https://social-nest-2.onrender.com", {
  withCredentials: true,
});

// Dashboard Component
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user"); // Use api.js to handle token
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login"); // Redirect to login if unauthorized
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout", { withCredentials: true }); // Use api.js for logout
      localStorage.removeItem("token"); // Clear token on logout
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
          <p className="text-lg mb-4">Email: {user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-center">No user data available</p>
      )}
    </div>
  );
};

// App Component with Token Handling
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  if (token) {
    // Clear existing cookie to avoid conflict
    document.cookie = "token=; Max-Age=0; path=/; domain=.social-nest-2.onrender.com";
    localStorage.setItem("token", token);
    window.history.replaceState({}, document.title, window.location.pathname);
    navigate("/home");
  }
}, [location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home/*" element={<LandingPage socket={socket} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id" element={<UserProfile />} />
      <Route path="/UpdateProfile" element={<UpdateProfile />} />
      <Route path="/CreatePost" element={<CreatePost />} />
      <Route path="/messages" element={<Messages socket={socket} />} />
      <Route path="/chat" element={<Chat socket={socket} />} />
      <Route path="/chat/:friendId" element={<Chat socket={socket} />} />
      <Route path="/saved" element={<SavedPost />} />
      {/* No need for separate GoogleCallback route; handled in useEffect */}
    </Routes>
  );
};

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} /> {/* Optional dashboard route */}
        <Route path="/*" element={<AppContent />} /> {/* Catch-all for other routes */}
      </Routes>
    </div>
  );
};

export default App;

