import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notFoundPage">
      <div className="windowContainer">
        {/* Window Controls */}
        <div className="windowControls">
          <div className="windowButton green"></div>
          <div className="windowButton red"></div>
          <div className="windowButton yellow"></div>
        </div>

        <div className="contentWrapper">
          {/* Left Illustration */}
          <div className="leftIllustration">
            <svg viewBox="0 0 600 400" className="illustrationSvg">
              {/* Background decorative elements */}
              <defs>
                <linearGradient id="plugGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#88BDF2" />
                  <stop offset="100%" stopColor="#5379AE" />
                </linearGradient>
                <linearGradient id="socketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BDDDFC" />
                  <stop offset="100%" stopColor="#97CADB" />
                </linearGradient>
              </defs>

              {/* Floating elements */}
              <circle cx="100" cy="80" r="25" fill="#88BDF2" opacity="0.6" className="floatingElement">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,-10; 0,0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              
              <circle cx="500" cy="120" r="30" fill="#BDDDFC" opacity="0.5" className="floatingElement">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,15; 0,0"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle cx="480" cy="300" r="20" fill="#97CADB" opacity="0.7" className="floatingElement">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,-8; 0,0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Leaves */}
              <g transform="translate(80,200)" className="leaf">
                <path d="M0,0 Q10,-15 20,0 Q10,15 0,0" fill="#A8C4EC" opacity="0.6">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0; 15; -15; 0"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              <g transform="translate(520,250)" className="leaf">
                <path d="M0,0 Q10,-15 20,0 Q10,15 0,0" fill="#D6E8EE" opacity="0.8">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0; -20; 20; 0"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              {/* Character 1 - Left side with plug */}
              <g transform="translate(120,180)" className="character1">
                {/* Large pink circle behind character */}
                <circle cx="0" cy="20" r="60" fill="url(#socketGradient)" opacity="0.3" />
                
                {/* Character body */}
                <g>
                  {/* Head */}
                  <circle cx="0" cy="-30" r="15" fill="#D6E8EE" />
                  
                  {/* Body */}
                  <rect x="-18" y="-15" width="36" height="45" rx="8" fill="#384959" />
                  
                  {/* Arms */}
                  <rect x="-35" y="-10" width="15" height="25" rx="7" fill="#384959" 
                        transform="rotate(-20)" />
                  <rect x="20" y="-10" width="15" height="25" rx="7" fill="#384959" 
                        transform="rotate(20)" />
                  
                  {/* Legs */}
                  <rect x="-15" y="30" width="12" height="30" rx="6" fill="#2C444C" />
                  <rect x="3" y="30" width="12" height="30" rx="6" fill="#2C444C" />
                  
                  {/* Electric plug in hand */}
                  <g transform="translate(35,-5) rotate(20)">
                    <rect x="0" y="0" width="20" height="15" rx="3" fill="url(#plugGradient)" />
                    <circle cx="5" cy="5" r="2" fill="#384959" />
                    <circle cx="15" cy="5" r="2" fill="#384959" />
                    <circle cx="10" cy="10" r="2" fill="#384959" />
                  </g>
                </g>

                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="120,180; 120,175; 120,180"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Character 2 - Right side with socket */}
              <g transform="translate(400,220)" className="character2">
                {/* Large pink circle behind character */}
                <circle cx="20" cy="0" r="65" fill="url(#plugGradient)" opacity="0.25" />
                
                {/* Character body */}
                <g>
                  {/* Head */}
                  <circle cx="0" cy="-25" r="15" fill="#D6E8EE" />
                  
                  {/* Body */}
                  <rect x="-18" y="-10" width="36" height="40" rx="8" fill="#384959" />
                  
                  {/* Arms */}
                  <rect x="-30" y="-5" width="15" height="20" rx="7" fill="#384959" 
                        transform="rotate(-15)" />
                  <rect x="15" y="-5" width="15" height="20" rx="7" fill="#384959" 
                        transform="rotate(15)" />
                  
                  {/* Legs */}
                  <rect x="-12" y="25" width="10" height="25" rx="5" fill="#2C444C" />
                  <rect x="2" y="25" width="10" height="25" rx="5" fill="#2C444C" />
                  
                  {/* Electric socket/outlet */}
                  <g transform="translate(40,5)">
                    <rect x="0" y="0" width="30" height="25" rx="5" fill="url(#socketGradient)" />
                    <rect x="5" y="5" width="8" height="3" rx="1" fill="#384959" />
                    <rect x="17" y="5" width="8" height="3" rx="1" fill="#384959" />
                    <circle cx="15" cy="15" r="3" fill="#384959" />
                  </g>
                </g>

                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="400,220; 400,215; 400,220"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Connecting cable */}
              <g className="cable">
                <path d="M170,175 Q250,140 Q320,160 380,215" 
                      stroke="#0474C4" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeLinecap="round">
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,300; 300,0; 0,300"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              {/* Floating 4 and 0 numbers */}
              <text x="200" y="120" fontSize="48" fontWeight="900" fill="#88BDF2" className="floatingNumber">
                4
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,-8; 0,0"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
              </text>
              
              <text x="350" y="320" fontSize="48" fontWeight="900" fill="#BDDDFC" className="floatingNumber">
                0
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,10; 0,0"
                  dur="4.2s"
                  repeatCount="indefinite"
                />
              </text>
            </svg>
          </div>

          {/* Right Content */}
          <div className="rightContent">
            <div className="errorSection">
              <h1 className="error404">404</h1>
              <h2 className="errorTitle">Oops...!</h2>
              <p className="errorText">
                Sorry, the page you are looking for cannot be found.
              </p>
              
              <div className="actionButtons">
                <button 
                  onClick={() => window.history.back()} 
                  className="goBackBtn"
                >
                  <svg className="backIcon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                  </svg>
                  Go Back
                </button>
                
                <Link to="/" className="homeBtn">
                  Take me home
        </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;