"use client";

import React, { useState, useEffect } from "react";
import { BiEdit } from "react-icons/bi";

export const UserProfile: React.FC = () => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [myName, setMyName] = useState<string>("Sanket Kedare");
  const [email, setEmail] = useState<string>("sanketkedare@example.com");
  const [imageURL, setImage] = useState<string>(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"
  );

  // Email validation regex
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  // Load saved data from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("name");
      const savedEmail = localStorage.getItem("email");
      const savedImageURL = localStorage.getItem("imageURL");

      if (savedName) setMyName(savedName);
      if (savedEmail) setEmail(savedEmail);
      if (savedImageURL) setImage(savedImageURL);
    } catch {
      // Use defaults
    }
  }, []);

  // Save data to localStorage and toggle edit mode
  const saveData = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.match(validRegex) || myName.length < 3) {
      alert("Please fill all required details with valid inputs.");
      return;
    }

    try {
      localStorage.setItem("name", myName);
      localStorage.setItem("email", email);
      localStorage.setItem("imageURL", imageURL);
    } catch {
      // Storage error
    }

    setEditOpen(false);
  };

  return (
    <div className="pb-10">
      <h1 className="text-center mt-14 my-10 font-bold lg:text-3xl text-2xl">
        User Profile Dashboard
      </h1>

      <div className="border rounded-2xl lg:w-[60%] w-[90%] m-auto p-6 bg-gray-900 bg-opacity-40 shadow-2xl">
        {editOpen ? (
          <form className="w-full py-2 flex flex-col gap-4" onSubmit={saveData}>
            <div>
              <label className="text-sm font-semibold block mb-1 text-gray-300">
                Full Name
              </label>
              <input
                placeholder="Your Name"
                aria-label="Name"
                className="w-full p-3 text-black rounded-xl outline-none"
                value={myName}
                onChange={(e) => setMyName(e.target.value)}
                type="text"
                required
              />
              {myName.length > 0 && myName.length < 3 && (
                <span className="text-red-400 text-xs mt-1 block">
                  Name must contain at least 3 characters
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1 text-gray-300">
                Email Address
              </label>
              <input
                placeholder="Email"
                aria-label="Email"
                className="w-full p-3 text-black rounded-xl outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              {!email.match(validRegex) && email.length > 0 && (
                <span className="text-red-400 text-xs mt-1 block">
                  Enter a valid email address
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1 text-gray-300">
                Profile Image URL
              </label>
              <input
                placeholder="Profile Image URL"
                aria-label="Profile Image URL"
                className="w-full p-3 text-black rounded-xl outline-none"
                value={imageURL}
                onChange={(e) => setImage(e.target.value)}
                type="text"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                className="p-3 w-1/2 bg-yellow-400 font-bold text-black rounded-xl hover:bg-yellow-500 transition-colors"
              >
                Save Data
              </button>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="p-3 w-1/2 bg-gray-600 font-bold text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full lg:py-5 relative text-center flex flex-col items-center">
            <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl mb-4 bg-gray-800">
              <img
                src={imageURL}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";
                }}
              />
            </div>
            <h1 className="text-3xl font-bold my-1">{myName}</h1>
            <p className="text-lg text-gray-400 my-1">{email}</p>

            <button
              className="mt-6 text-lg flex justify-center items-center p-3 gap-2 w-[140px] border rounded-xl bg-yellow-400 text-black hover:bg-sky-400 font-bold shadow-md transition-colors"
              onClick={() => setEditOpen(true)}
            >
              <BiEdit className="text-xl" /> Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
