import { useEffect, useRef } from "react";

export const useOutSide = (handler: any) => {
  let Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMouse = (e: any) => {
      if (!Ref.current?.contains(e.target)) {
        handler();
      }
    };
    document.addEventListener("mousedown", checkMouse);
    return () => document.removeEventListener("mousedown", checkMouse);
  }, []);

  return Ref;
};
