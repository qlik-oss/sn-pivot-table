import { useEffect, useState } from "react";

export const useIntersectionObserver = (objRef: any, colIndex: number) => {
  const [isVisible, setIsVisible] = useState(false);

  const cb = (entries: any) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  const opt = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(cb, opt);
    if (objRef.current) observer.observe(objRef.current);

    return () => {
      if (objRef.current) observer.unobserve(objRef.current);
    };
  }, [objRef, opt]);

  return {
    isVisible,
  };
};
