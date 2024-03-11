import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Spinner from "../spinner/spinner";
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";

const UserForm = ({ username, bio, followers, following, reviews, profilePicture }) => {
  const [newBio, setNewBio] = useState(bio || "");
  const [newProfilePicture, setNewProfilePicture] = useState(profilePicture || "");
  const [spinner, setSpinner] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Additional setup or fetching data can be done here if needed.
  }, []);

  const handleUpdateProfile = async (ev) => {
    ev.preventDefault();
    
    // Example: Update user profile API call
    try {
      setSpinner(true);
      const response = await axios.put('/api/user/profile', {
        username: session.user.name,
        bio: newBio,
        profilePicture: newProfilePicture,
      });

      // Handle the response as needed
      console.log("Profile Updated:", response.data);

    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error, e.g., show a user-friendly message
    } finally {
      setSpinner(false);
    }
  };

  const uploadProfilePicture = async (ev) => {
    const file = ev.target?.files[0];
    if (file) {
      setSpinner(true);
      const data = new FormData();
      data.append("file", file);

      try {
        const res = await axios.post('/api/upload', data);
        setNewProfilePicture(res.data.links[0]);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        // Handle error, e.g., show a user-friendly message
      } finally {
        setSpinner(false);
      }
    }
  };

  return (
    <form className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md" onSubmit={handleUpdateProfile}>
      <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
      <input
        className="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
        type="text"
        value={username}
        readOnly
      />

      <label className="block text-sm font-semibold text-gray-600 mt-4 mb-1">Profile Picture</label>
      <div className="mb-2 flex flex-wrap gap-2">
        {newProfilePicture && (
          <div className="relative group h-24">
            <img src={newProfilePicture} className="rounded-lg" alt="Profile" />
          </div>
        )}
        {spinner && (
          <div className="inline-block w-24 h-24 justify-center p1 bg-gray-100 flex items-center rounded-lg">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900">
              <Spinner />
            </div>
          </div>
        )}
        <label className="inline-block cursor-pointer w-24 h-24 border flex justify-center items-center text-sm text-gray-500 text-center rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>Change</div>
          <input type="file" onChange={uploadProfilePicture} className="hidden" />
        </label>
      </div>

      <label className="block text-sm font-semibold text-gray-600 mt-4 mb-1">Bio</label>
      <textarea
        className="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
        type="text"
        value={newBio}
        placeholder="Bio"
        onChange={(ev) => setNewBio(ev.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue mt-4"
      >
        Update Profile
      </button>
    </form>
  );
};

export default UserForm;