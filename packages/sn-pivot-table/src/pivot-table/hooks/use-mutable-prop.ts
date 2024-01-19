import { useRef } from "react";

const useMutableProp = <T>(value: T) => {
  const mutableRef = useRef<T>(value);
  mutableRef.current = value;

  return mutableRef;
};

export default useMutableProp;
