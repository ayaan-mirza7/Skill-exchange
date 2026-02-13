import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import pic from "../assets/profile.svg";
import "./Profile.css";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
  });

  // 🔥 FETCH PROFILE FROM BACKEND
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        // ✅ IMPORTANT FIX
        setProfile({
          name: data.name || "",
          gender: data.gender || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 🔥 SAVE TO BACKEND
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: profile.name,
          gender: profile.gender,
          phone: profile.phone,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      await res.json();

      setIsEditing(false); // ✅ exits edit mode correctly
    } catch (err) {
      console.error("Update error:", err);
    }
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

              {!isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
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
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
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
  