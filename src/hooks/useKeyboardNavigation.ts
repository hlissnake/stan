import { useCallback, useEffect, useState } from "react";

interface Props {
  size: number;
  onEnter: (index: number) => void;
  initialSelected?: number;
}

const useKeyboardNavigation = ({
  onEnter,
  size,
  initialSelected = 0,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(initialSelected);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (size === 0) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev < size - 1 ? prev + 1 : prev));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (event.key === "Enter") {
        event.preventDefault();
        onEnter(selectedIndex);
      }
    },
    [onEnter, selectedIndex, size]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(initialSelected);
  }, [initialSelected]);

  return selectedIndex;
};

export default useKeyboardNavigation;
