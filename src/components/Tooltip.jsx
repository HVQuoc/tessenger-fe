import { useState } from "react";

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full transform mb-2 px-3 py-1 text-sm text-white bg-gray-600 rounded-md shadow-lg whitespace-nowrap">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;