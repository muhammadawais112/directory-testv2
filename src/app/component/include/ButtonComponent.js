import React from "react";
import { useAgencyInfo } from "context/agency";

function GlobalButton({ children, onClick, styleOverride, className, ...props }) {
    const [agency] = useAgencyInfo();
    const themeContent = agency?.theme_id?.theme_data;

    // Default styles derived from the theme
    const defaultStyles = {
        background: themeContent?.general?.button_bg || "#007bff", // Fallback color
        color: themeContent?.general?.button_text || "#ffffff",    // Fallback text color
        border: "none",
        borderRadius: "4px",
        padding: "8px 16px",
        fontSize: "14px",
        cursor: "pointer",
    };

    // Merge default styles with any overrides
    const combinedStyles = { ...defaultStyles, ...styleOverride };

    return (
        <button
            onClick={onClick}
            style={combinedStyles}
            className={`rounded-md text-sm ${className || ""}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default GlobalButton;
