// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Posts from "./Posts"; // Import the Posts component
// import { useNavigate } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";

// const SavedPosts = () => {
//   const [savedPosts, setSavedPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSavedPosts = async () => {
//       try {
//         setLoading(true);
//         // Fetch all saved posts for the authenticated user
//         const res = await axios.get(
//           "https://social-nest-2.onrender.com/api/auth/saved-posts",
//           {
//             withCredentials: true,
//           }
//         );
//         // Filter out null or invalid posts
//         const validPosts = (res.data.savedPosts || []).filter(
//           (post) =>
//             post &&
//             post._id &&
//             post.createdAt &&
//             post.user &&
//             post.user.name &&
//             post.user.image
//         );
//         console.log("Valid saved posts:", validPosts);
//         // Map posts to include the 'liked' field expected by Posts component
//         const formattedPosts = validPosts.map((post) => ({
//           ...post,
//           liked: post.liked || false, // Ensure 'liked' field is present
//         }));
//         setSavedPosts(formattedPosts);
//       } catch (error) {
//         console.error("Error fetching saved posts:", error);
//         setError("Please log in to view saved posts.");
//         if (error.response?.status === 401) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSavedPosts();
//   }, [navigate]);

//   const handleClearAll = async () => {
//     if (!window.confirm("Are you sure you want to clear all saved posts?"))
//       return;
//     try {
//       if (savedPosts.length === 0) {
//         alert("No saved posts to clear!");
//         return;
//       }

//       // Unsave all posts
//       await Promise.all(
//         savedPosts.map((post) =>
//           axios.post(
//             `https://social-nest-2.onrender.com/api/${post._id}/unsave`,
//             {},
//             { withCredentials: true }
//           )
//         )
//       );
//       setSavedPosts([]);
//       alert("All saved posts cleared!");
//     } catch (error) {
//       console.error("Error clearing saved posts:", error);
//       alert(error.response?.data?.message || "Failed to clear saved posts.");
//     }
//   };

//   const handleBackClick = () => {
//     navigate("/home");
//   };

//   if (loading) {
//     return (
//       <p className="text-center text-gray-500 text-sm sm:text-base">
//         Loading saved posts...
//       </p>
//     );
//   }

//   if (error) {
//     return (
//       <p className="text-center text-red-500 text-sm sm:text-base">{error}</p>
//     );
//   }

//   return (
//     <div className="w-full max-w-[90%] xs:max-w-[85%] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-7xl mx-auto p-2 xs:p-3 sm:p-4 md:p-5 overflow-x-hidden">
//       {/* Back Button */}
//       <div className="mb-3 xs:mb-4 sm:mb-5">
//         <button
//           onClick={handleBackClick}
//           className="flex items-center gap-1 xs:gap-2 text-blue-500 font-semibold hover:text-blue-600 transition duration-200 text-sm xs:text-base sm:text-lg"
//         >
//           <IoArrowBack className="text-lg xs:text-xl sm:text-2xl" />
//           Back to Home
//         </button>
//       </div>

//       {/* Header with Title and Clear All Button */}
//       <div className="flex justify-between items-center mb-2 xs:mb-3 sm:mb-4 md:mb-5">
//         <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">
//           Your Saved Posts ({savedPosts.length})
//         </h1>
//         {savedPosts.length > 0 && (
//           <button
//             onClick={handleClearAll}
//             className="bg-red-500 text-white px-2 xs:px-3 sm:px-3 md:px-4 py-1 xs:py-1 sm:py-1.5 md:py-2 rounded-lg hover:bg-red-600 transition text-xs xs:text-sm sm:text-base"
//           >
//             Clear All
//           </button>
//         )}
//       </div>

//       {/* Posts Section */}
//       <div className="w-full">
//         <Posts posts={savedPosts} setPosts={setSavedPosts} />
//       </div>
//     </div>
//   );
// };

// export default SavedPosts;



import React, { useEffect, useState } from "react";
import api from "../../api"; // Import api instance
import Posts from "./Posts"; // Import the Posts component
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        // Fetch all saved posts for the authenticated user
        const res = await api.get("/auth/saved-posts"); // Use api
        // Filter out null or invalid posts
        const validPosts = (res.data.savedPosts || []).filter(
          (post) =>
            post &&
            post._id &&
            post.createdAt &&
            post.user &&
            post.user.name &&
            post.user.image
        );
        console.log("Valid saved posts:", validPosts);
        // Map posts to include the 'liked' field expected by Posts component
        const formattedPosts = validPosts.map((post) => ({
          ...post,
          liked: post.liked || false, // Ensure 'liked' field is present
        }));
        setSavedPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        setError("Please log in to view saved posts.");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, [navigate]);

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all saved posts?"))
      return;
    try {
      if (savedPosts.length === 0) {
        alert("No saved posts to clear!");
        return;
      }

      // Unsave all posts
      await Promise.all(
        savedPosts.map((post) =>
          api.post(`/${post._id}/unsave`, {}, { withCredentials: true }) // Use api
        )
      );
      setSavedPosts([]);
      alert("All saved posts cleared!");
    } catch (error) {
      console.error("Error clearing saved posts:", error);
      alert(error.response?.data?.message || "Failed to clear saved posts.");
    }
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-sm sm:text-base">
        Loading saved posts...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 text-sm sm:text-base">{error}</p>
    );
  }

  return (
    <div className="w-full max-w-[90%] xs:max-w-[85%] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-7xl mx-auto p-2 xs:p-3 sm:p-4 md:p-5 overflow-x-hidden">
      {/* Back Button */}
      <div className="mb-3 xs:mb-4 sm:mb-5">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-1 xs:gap-2 text-blue-500 font-semibold hover:text-blue-600 transition duration-200 text-sm xs:text-base sm:text-lg"
        >
          <IoArrowBack className="text-lg xs:text-xl sm:text-2xl" />
          Back to Home
        </button>
      </div>

      {/* Header with Title and Clear All Button */}
      <div className="flex justify-between items-center mb-2 xs:mb-3 sm:mb-4 md:mb-5">
        <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">
          Your Saved Posts ({savedPosts.length})
        </h1>
        {savedPosts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="bg-red-500 text-white px-2 xs:px-3 sm:px-3 md:px-4 py-1 xs:py-1 sm:py-1.5 md:py-2 rounded-lg hover:bg-red-600 transition text-xs xs:text-sm sm:text-base"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Posts Section */}
      <div className="w-full">
        <Posts posts={savedPosts} setPosts={setSavedPosts} />
      </div>
    </div>
  );
};

export default SavedPosts;