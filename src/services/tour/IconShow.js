"use client";

import React, { useState, useEffect } from "react";

const IconShow = ({ iconName }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    const loadIcon = async () => {
      if (!iconName) return;

      try {
        let LoadedIcon = null;

        if (iconName.startsWith("Tb")) {
          const icons = await import("react-icons/tb");
          LoadedIcon = icons[iconName];
        } else if (iconName.startsWith("Io")) {
          const icons = await import("react-icons/io5");
          LoadedIcon = icons[iconName];
        } else if (iconName.startsWith("Fa")) {
          const icons = await import("react-icons/fa");
          LoadedIcon = icons[iconName];
        } else if (iconName.startsWith("Ci")) {
          const icons = await import("react-icons/ci");
          LoadedIcon = icons[iconName];
        } else if (iconName.startsWith("Go")) {
          const icons = await import("react-icons/go");
          LoadedIcon = icons[iconName];
        } else if (iconName.startsWith("Pi")) {
          const icons = await import("react-icons/pi");
          LoadedIcon = icons[iconName];
        } else {
          console.error(`Unknown icon library for: ${iconName}`);
          return;
        }

        setIconComponent(() => LoadedIcon);
      } catch (error) {
        console.error("Error dynamically loading icon:", error);
      }
    };

    loadIcon();
  }, [iconName]);

  return IconComponent ? <IconComponent size={20} /> : null;
};

export default IconShow;
