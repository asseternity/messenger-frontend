import { useEffect, useState } from "react";
import defaultProfilePic from "/silhouette.png";

// [v] hook up to open profiles through the search tab

// other people's profiles:
// [v] display username, bio, profile pic
// [_] css display
// [_] follow / message buttons
// [_] posts of that person under their profile

// your profile:
// [v] display username, bio, profile pic
// [_] css display
// [_] editing mode for your profile
// [_] your posts under your profile
// [_] delete the the post

/* eslint-disable react/prop-types */
const Profile = ({ targetUser }) => {
  return (
    <div className="profile_container">
      <div className="profile_pic_container">
        <img
          src={
            targetUser.profilePicture
              ? `https://messenger-backend-production-a259.up.railway.app/uploads/${targetUser.profilePicture}`
              : defaultProfilePic
          }
        ></img>
      </div>
      <div className="profile_text_container">
        <h3 className="profile_username">{targetUser.username}</h3>
        <div className="profile_bio"></div>
        {targetUser.bio ? targetUser.bio : "This user has not added a bio."}
      </div>
    </div>
  );
};

export default Profile;
