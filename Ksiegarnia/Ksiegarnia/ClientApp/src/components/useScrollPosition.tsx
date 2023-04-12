import { useState, useEffect } from "react";

const useScrollPosition = (props: { handleScrollBottom?: () => void }) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const updatePosition = () => {
    setScrollPosition(window.pageYOffset);

    if (props.handleScrollBottom) {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        props.handleScrollBottom();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", updatePosition);
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
