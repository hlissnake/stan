import { useCallback, useEffect } from "react";

const useBackspace = (onEsc: () => void) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      console.log(event.key)
      if (event.key === "Backspace") {
        event.preventDefault();
        onEsc();
      }
    },
    [onEsc]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useBackspace;
