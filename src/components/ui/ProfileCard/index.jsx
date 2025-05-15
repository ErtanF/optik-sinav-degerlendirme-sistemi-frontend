import React from 'react';
import './ProfileCard.css';

const ProfileCard = ({ label, value, icon }) => {
  return (
    <div className="profile-card">
      {icon && <div className="profile-card-icon">{icon}</div>}
      <div className="profile-card-content">
        <span className="profile-card-label">{label}</span>
        <span className="profile-card-value">{value}</span>
      </div>
    </div>
  );
};

export default ProfileCard; 