import { FaRegSmile } from "react-icons/fa";
import { HiPhoto } from "react-icons/hi2";
import { ImAttachment } from "react-icons/im";
import { FaVideo } from "react-icons/fa";
import { HiOutlineHashtag } from "react-icons/hi2";
import { VscMention } from "react-icons/vsc";
import { BsThreeDotsVertical } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiImageOn } from "react-icons/ci";
import Posts from "./Posts";
import { useLocation } from "react-router-dom";

const Second = () => {
  //   const [title, setTitle] = useState('');
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [profileimage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/Profile", {
          withCredentials: true,
        });

        const data = res.data;

        setProfileImage(data.image);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desc || !image) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/posts/CreatePost",
        { description: desc, image },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = res.data;
      setMessage("Post created successfully!");
      setDesc("");
      setImage("");
      setPreview("");
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" p-4 h-screen">
      <div className="Status bg-white shadow-lg rounded-2xl p-3 flex items-center w-full gap-5">
        <img
          src="./Profile.png"
          alt="logos"
          className="w-20 h-20 rounded-full border-3"
        />
        <img
          src="./Profile.png"
          alt="logos"
          className="w-20 h-20 rounded-full border-3"
        />
        <img
          src="./Profile.png"
          alt="logos"
          className="w-20 h-20 rounded-full border-3"
        />
        <img
          src="./Profile.png"
          alt="logos"
          className="w-20 h-20 rounded-full border-3"
        />
        <img
          src="./Profile.png"
          alt="logos"
          className="w-20 h-20 rounded-full border-3"
        />
        <img
          src="./Profile.png"
          alt="logos"
          className="w-20 h-20 rounded-full border-3"
        />
        <img
          src="./Profile.png"
          alt="logos"
          className="w-20 h-20 rounded-full border-3"
        />
        <img
          src="./Profile.png"
          alt="logos"
          className="w-20 h-20 rounded-full border-3"
        />
      </div>

      {/* _____________________________________________________________________________________ */}

      <form onSubmit={handleSubmit}>
          
            <div className="bg-white shadow-lg w-full p-5 mt-2 rounded-2xl flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <img
                    src={profileimage || "/Profile.png"}
                    alt="logos"
                    className="w-8 h-8 rounded-full border-3"
                  />
                  <input
                    placeholder="Write Something here....."
                    className="border-none bg-gray-100 p-3 rounded-2xl w-full focus:outline-none text-black text-[15px] "
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                    // style={{
                    //   display: "block",
                    //   marginBottom: "10px",
                    //   width: "100%",
                    // }}
                  />
                </div>
                
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-[200px] w-full object-cover rounded-xl flex items-center"
                  />
                )}
              </div>

              <div className="Post-section flex gap-3 items-center justify-between mt-2">
                  <div className="p-4 flex gap-5">
                    <label htmlFor="image" className="cursor-pointer">
                      <CiImageOn />
                    </label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      style={{ marginBottom: "10px" }}
                      className="hidden"
                    />

                    <FaRegSmile />
                  </div>
                  
                  <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">{loading ? "posting ...." : "post"}</button>
              </div>

              
            </div>
          
      
      </form>

      <Posts />

      {/* ___________________________________________________________________________________________________________________________________________ */}
    </div>

    /* <p className='flex items-center gap-1.5'><ImAttachment className='text-orange-400 ' />Attachment</p>
                <p className='flex items-center gap-1.5'><FaVideo className='text-red-600 '/>Live</p>
                <p className='flex items-center gap-1.5'><HiOutlineHashtag className='text-green-500 ' />Hashtag</p>
                <p className='flex items-center gap-1.5'><VscMention />Mention</p> */
  );
};

export default Second;
