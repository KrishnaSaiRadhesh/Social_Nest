// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Social Media Sidebar</title>
//   <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js"></script>
//   <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js"></script>
//   <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.22.9/babel.min.js"></script>
//   <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
// </head>
// <body>
//   <div id="root"></div>

//   <script type="text/babel">
//     const Sidebar = () => {
//       return (
//         <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col justify-between">
//           {/* Profile Section */}
//           <div>
//             <div className="flex items-center space-x-3">
//               <img
//                 src="https://via.placeholder.com/40"
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full"
//               />
//               <div>
//                 <div className="flex items-center space-x-1">
//                   <h2 className="font-semibold text-gray-800">Jakob Botosh</h2>
//                   <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
//                     <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
//                     </svg>
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-500">@jakobbtsh</p>
//               </div>
//             </div>
//             <div className="flex justify-between mt-3 text-gray-600 text-sm">
//               <div>
//                 <p className="font-semibold">2.3K</p>
//                 <p>Follower</p>
//               </div>
//               <div>
//                 <p className="font-semibold">235</p>
//                 <p>Following</p>
//               </div>
//               <div>
//                 <p className="font-semibold">80</p>
//                 <p>Post</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Menu */}
//           <div className="mt-6">
//             <div className="flex items-center space-x-3 bg-blue-500 text-white p-2 rounded-lg">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//               </svg>
//               <span>FEED</span>
//             </div>
//             <div className="flex items-center space-x-3 p-2 mt-2 text-gray-600">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//               <span>Friends</span>
//             </div>
//             <div className="flex items-center justify-between p-2 mt-2 text-gray-600">
//               <div className="flex items-center space-x-3">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span>Event</span>
//               </div>
//               <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">4</span>
//             </div>
//             <div className="flex items-center space-x-3 p-2 mt-2 text-gray-600">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//               </svg>
//               <span>WATCH VIDEOS</span>
//             </div>
//             <div className="flex items-center space-x-3 p-2 mt-2 text-gray-600">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <span>Photos</span>
//             </div>
//             <div className="flex items-center space-x-3 p-2 mt-2 text-gray-600">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 3v18M3 3h18M3 9h18M9 3v18M15 3v18M3 15h18M3 21h18" />
//               </svg>
//               <span>Marketplace</span>
//             </div>
//             <div className="flex items-center justify-between p-2 mt-2 text-gray-600">
//               <div className="flex items-center space-x-3">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
//                 </svg>
//                 <span>Files</span>
//               </div>
//               <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1">7</span>
//             </div>
//           </div>

//           {/* Pages You Like Section */}
//           <div className="mt-6">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase">Pages You Like</h3>
//             <div className="mt-3 space-y-2">
//               <div className="flex items-center space-x-2">
//                 <div className="w-6 h-6 bg-blue-500 rounded"></div>
//                 <span className="text-gray-600">UI/UX Community...</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-6 h-6 bg-gray-300 rounded"></div>
//                 <span className="text-gray-600">Web Designer</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-6 h-6 bg-pink-500 rounded"></div>
//                 <span className="text-gray-600">Dribbble Community</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-6 h-6 bg-blue-600 rounded"></div>
//                 <span className="text-gray-600">Behance</span>
//                 <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
//                   <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
//                   </svg>
//                 </span>
//               </div>
//               <p className="text-blue-500 text-sm mt-2 cursor-pointer">View All</p>
//             </div>
//           </div>

//           {/* Footer Links */}
//           <div className="text-xs text-gray-500 flex space-x-2">
//             <a href="#" className="hover:underline">Privacy</a>
//             <span>·</span>
//             <a href="#" className="hover:underline">Terms</a>
//             <span>·</span>
//             <a href="#" className="hover:underline">Advertising</a>
//             <span>·</span>
//             <a href="#" className="hover:underline">Cookies</a>
//           </div>
//           <div className="text-xs text-gray-500 mt-1">
//             Platform © 2023
//           </div>
//         </div>
//       );
//     };
//   </script>
// </body>
// </html>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Media Feed</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.22.9/babel.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const Feed = () => {
      const stories = [
        { name: "Your Story", img: "https://via.placeholder.com/60", isUser: true },
        { name: "Justin Rosser", img: "https://via.placeholder.com/60" },
        { name: "Davis Dorwart", img: "https://via.placeholder.com/60" },
        { name: "Randy Saris", img: "https://via.placeholder.com/60" },
        { name: "Charlie Press", img: "https://via.placeholder.com/60" },
        { name: "Zaire Herwitz", img: "https://via.placeholder.com/60" },
        { name: "Talan Philips", img: "https://via.placeholder.com/60" },
        { name: "Corey Gouse", img: "https://via.placeholder.com/60" },
      ];

      return (
        <div className="max-w-2xl mx-auto p-4">
          {/* Stories Section */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {stories.map((story, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`relative w-16 h-16 rounded-full ${story.isUser ? 'border-2 border-gray-300' : 'border-2 border-pink-500'}`}>
                  <img
                    src={story.img}
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  {story.isUser && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 mt-1 text-center">{story.name}</span>
              </div>
            ))}
          </div>

          {/* Post Input Box */}
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <input
                type="text"
                placeholder="What's on your mind?"
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Share Post
              </button>
            </div>
            <div className="flex justify-between mt-3 text-gray-600 text-sm">
              <button className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Image/Video</span>
              </button>
              <button className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656L5.757 10.757" />
                </svg>
                <span>Attachment</span>
              </button>
              <button className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Live</span>
              </button>
              <button className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span>Hashtag</span>
              </button>
              <button className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5 9 5 9-5-9-5z" />
                </svg>
                <span>Mention</span>
              </button>
              <select className="text-gray-600 text-sm outline-none">
                <option>Public</option>
              </select>
            </div>
            <div className="flex justify-end mt-2 text-gray-600 text-sm">
              <span>Sort by: Following</span>
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Post Section */}
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://via.placeholder.com/40"
                alt="Cameron"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">Cameron Williamson</p>
                <p className="text-sm text-gray-500">14 Aug at 4:21 PM</p>
              </div>
              <div className="ml-auto">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <img
                src="https://via.placeholder.com/300x200/EDE9FE"
                alt="Post 1"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                src="https://via.placeholder.com/300x200/EDE9FE"
                alt="Post 2"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="flex justify-between mt-3 text-gray-600 text-sm">
              <div className="flex space-x-3">
                <button className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>30 Like</span>
                </button>
                <button className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>12 Comment</span>
                </button>
                <button className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>5 Share</span>
                </button>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
          </div>

          {/* Additional Post Placeholder */}
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://via.placeholder.com/40"
                alt="Terry"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">Terry Lipshutz</p>
                <p className="text-sm text-gray-500">14 Aug at 4:21 PM</p>
              </div>
            </div>
          </div>
        </div>
      );
    };

    ReactDOM.render(<Feed />, document.getElementById('root'));
  </script>
</body>
</html>