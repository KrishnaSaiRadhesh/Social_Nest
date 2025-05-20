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
// const socket = io('http://localhost:3000', { withCredentials: true });

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



import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import LandingPage from './Pages/LandingPage';
import Profile from './Components/Profile/Profile';
import UpdateProfile from './Components/Profile/UpdateProfile';
import CreatePost from './Components/Posts/CreatePost';
import UserProfile from './Components/Profile/UserProfile';
import Messages from './Components/Chat/Messages';
import Chat from './Components/Chat/Chat';
import io from 'socket.io-client';
import SavedPost from './Components/Landing/SavedPost'

const socket = io('http://localhost:3000', { withCredentials: true });

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home/*" element={<LandingPage socket={socket} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/UpdateProfile" element={<UpdateProfile />} />
        <Route path="/CreatePost" element={<CreatePost />} />
        <Route path="/messages" element={<Messages socket={socket} />} />
        <Route path="/chat/:friendId" element={<Chat socket={socket} />} />
        <Route path="/saved" element={<SavedPost/>} />
      </Routes>
    </div>
  );
};

export default App;