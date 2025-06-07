import { useCallback, useEffect, useState } from "react";

const useKeyboardNavigation = (
  onEnter: (index: number) => void,
  length: number,
  enabled = true
) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (length === 0 || !enabled) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev < length - 1 ? prev + 1 : prev));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (event.key === "Enter") {
        event.preventDefault();
        onEnter(selectedIndex);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onEnter(-1);
      }
    },
    [onEnter, selectedIndex, length, enabled]
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
