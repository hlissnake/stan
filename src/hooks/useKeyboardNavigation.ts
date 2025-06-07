import { useCallback, useEffect, useState } from "react";

const useKeyboardNavigation = (
  onEnter: (index: number) => void,
  length: number,
) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (length === 0) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev < length - 1 ? prev + 1 : prev));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (event.key === "Enter") {
        event.preventDefault();
        onEnter(selectedIndex);
      }
    },
    [onEnter, selectedIndex, length]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return selectedIndex;
};

export default useKeyboardNavigation;
