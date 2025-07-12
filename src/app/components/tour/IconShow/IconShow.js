"use client"
import React, { useState, useEffect } from 'react';

const IconShow = ({ iconName }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    const loadIcon = async () => {
      if (!iconName) return;

      try {
        let LoadedIcon = null;

        if (iconName.startsWith("Tb")) {
          const { [iconName]: Icon } = await import("react-icons/tb");
          LoadedIcon = Icon;
        } else if (iconName.startsWith("Io")) {
          const { [iconName]: Icon } = await import("react-icons/io5");
          LoadedIcon = Icon;
        } else if (iconName.startsWith("Fa")) {
          const { [iconName]: Icon } = await import("react-icons/fa");
          LoadedIcon = Icon;
        } else if (iconName.startsWith("Ci")) {
            const { [iconName]: Icon } = await import("react-icons/ci");
            LoadedIcon = Icon;
          }else if (iconName.startsWith("Go")) {
            const { [iconName]: Icon } = await import("react-icons/go");
            LoadedIcon = Icon;
          }else if (iconName.startsWith("Pi")) {
            const { [iconName]: Icon } = await import("react-icons/pi");
            LoadedIcon = Icon;
          }
          
        else {
          console.error(`#: ${iconName}`);
          return;
        }

        setIconComponent(() => LoadedIcon);
      } catch (error) {
        console.error("Error dynamically loading icon:", error);
      }
    };

    loadIcon();
  }, [iconName]);

  // Return the icon component, or null if not loaded
  return IconComponent ? <IconComponent size={25} style={{"color":"#284673"}} /> : null;
};

export default IconShow;
