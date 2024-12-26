import { useEffect, useState } from "react";
import defaultProfilePic from "/silhouette.png";

// [v] hook up to open profiles through the search tab

// other people's profiles:
// [_] display username, bio, profile pic
// [_] css display
// [_] follow / message buttons
// [_] posts of that person under their profile

// your profile:
// [_] display username, bio, profile pic
// [_] css display
// [_] editing mode for your profile
// [_] your posts under your profile
// [_] delete the the post

/* eslint-disable react/prop-types */
const Profile = ({ targetUser }) => {
  return (
    <div>
      <h3>{targetUser.username}</h3>
      <img
        src={
          targetUser.profilePicture
            ? `https://messenger-backend-production-a259.up.railway.app/uploads/${targetUser.profilePicture}`
            : defaultProfilePic
        }
      ></img>
      <p>
        {targetUser.bio ? targetUser.bio : "This user has not added a bio."}
      </p>
    </div>
  );
};

export default Profile;
