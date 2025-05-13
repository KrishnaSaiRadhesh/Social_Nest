import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [followers,setFollowers]=useState([])
  const [following,setFollowing]=useState([])
  const [posts,setPosts]=useState([])
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/user/profile`, {
          withCredentials: true,
        });
        const data = res.data;
        setName(data.name);
        setEmail(data.email);
        setImage(data.image);
        setFollowers(data.followers)
        setFollowing(data.following)
        setPosts(data.posts)
        

      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile. Please try again.");
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);





  const handleUpdateClick = () => {
    navigate('/UpdateProfile', {
      state: { name, email, image }
    });
  };
 
  return (

    <div>
    <div className='flex flex-col justify-center items-center max-w-7xl mx-auto p-3'>
          <div className='flex justify-center items-start gap-10  p-3'>
            <div> 
                <img src={image} alt="" className='w-[200px]'/>
                <p className='font-semibold text-[18px] mt-3 text-center'>{email}</p>
            </div>

            <div>
                <h1 className='text-[25px]'>{name}</h1>

                <div className='flex gap-5 mt-3 text-[22px]'>
                    <div>
                        <h2 className='font-bold text-2xl'>{followers?.length}</h2>
                        <p>followers</p>
                    </div>

                    <div>
                        <h2 className='font-bold text-2xl'>{following?.length}</h2>
                        <p>Following</p>
                    </div>

                    <div>
                        <h2 className='font-bold text-2xl'>{posts?.length}</h2>
                        <p>Post</p>
                    </div>
                </div>

                  <div className='flex gap-5 pt-10'>
                    <button className='bg-blue-500 text-white p-2 rounded-lg cursor-pointer' onClick={handleUpdateClick}>Edit profile</button>
                    <button className='bg-blue-500 text-white p-2 rounded-lg  cursor-pointer'>Share Profile</button>
              </div>

            </div>
           
            </div>
           

          </div>
              {/* posts  */}
            <div className='mx-auto max-w-7xl'>
                <div className='my-2 pb-2 bg-white shadow-xl grid grid-cols-3'>
                    {
                      posts.map((post) => (
                          <div key={post._id} className=''>
                                <img src={post.image} alt="" className=' w-[200px] h-[200px] object-contain'/>
                          </div>
                      ))
                    }
                </div>
            </div>
    </div>

    
  );
};

export default Profile;