import React, { useState } from "react";
import { useEffect } from "react";

function RemoveAccessModel({ open }) {
  
     const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive modal width
  const getModalWidth = () => {
    if (windowWidth <= 480) return '95vw';
    if (windowWidth <= 768) return '90vw';
    if (windowWidth <= 1024) return '70vw';
    return '50vw';
  };
  

  const headerStyle = {
    padding: "20px 30px",
    borderBottom: "1px solid #eee",
    backgroundColor: "#f7f7f7",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  };

  const contentStyle = {
    padding: "30px",
    fontSize: "14px",
    color: "#333",
    lineHeight: 1.7,
    backgroundColor: "#fff",
    textAlign: "center",
    '@media (max-width: 768px)': {
      padding: "20px 15px",
    },
  };

  const paragraphStyle = {
    marginBottom: "12px",
    textAlign: "center",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1040,
  };

  // Responsive modal container
  const modalContainerStyle = {
    width: getModalWidth(),
    maxHeight: windowWidth <= 768 ? '80vh' : '50vh',
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    zIndex: 1050,
  };

  // Responsive heading styles
  const headingStyle = {
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
    '@media (max-width: 768px)': {
      fontSize: "18px",
    },
  };

  const mainHeadingStyle = {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "20px",
    '@media (max-width: 768px)': {
      fontSize: "18px",
      marginBottom: "15px",
    },
  };

  // Convert style objects to actual CSS with media queries
  const getStyles = (styleObj) => {
    const base = { ...styleObj };
    delete base['@media'];
    return base;
  };

  const getMediaQueries = (styleObj) => {
    const mediaQueries = {};
    for (const key in styleObj) {
      if (key.startsWith('@media')) {
        mediaQueries[key] = styleObj[key];
      }
    }
    return mediaQueries;
  };

  return (
    <>
      {open && (
        <>
          <div style={overlayStyle} />
          <div className="modal-zz-confirm">
            <div 
              style={getStyles(modalContainerStyle)}
              css={getMediaQueries(modalContainerStyle)}
            >
              <div style={headerStyle}>
                <h2 style={getStyles(headingStyle)} css={getMediaQueries(headingStyle)}>
                  Access Removed
                </h2>
              </div>
              <div style={getStyles(contentStyle)} css={getMediaQueries(contentStyle)}>
                <h1 style={getStyles(mainHeadingStyle)} css={getMediaQueries(mainHeadingStyle)}>
                 Your Access to SmartDirectoryAI is Currently Restricted.
                </h1>
                <p style={paragraphStyle}>
                  Please contact your Agency for regrant your access
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default RemoveAccessModel;