import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import pic from "../assets/profile.svg";
import "./Profile.css";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Ayaan Mirza",
    gender: "Male",
    email: "ayaan@example.com",
    phone: "9876543210",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log(profile); // connect backend later
  };

  return (
    <>
      <Navbar />

      <div className="profile-wrapper">
        <div className="profile-container-big">
          {/* LEFT SIDE */}
          <div className="profile-left-big">
            <img src={pic} alt="Profile" className="profile-pic-big" />
            <button className="change-photo-btn-big">
              Change Profile Photo
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="profile-right-big">
            <div className="profile-header">
              <h2>My Profile</h2>

              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              ) : null}
            </div>

            <div className="profile-form">
              <div className="profile-row">
                <label>Name</label>
                {isEditing ? (
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.name}</p>
                )}
              </div>

              <div className="profile-row">
                <label>Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                ) : (
                  <p>{profile.gender}</p>
                )}
              </div>

              <div className="profile-row">
                <label>Email</label>
                <p className="readonly">{profile.email}</p>
              </div>

              <div className="profile-row">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>

              {isEditing && (
                <div className="profile-actions">
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
