import useNebulaRef from "./use-nebula-ref";

const useMutableNebulaProp = <T>(value: T) => {
  const mutableRef = useNebulaRef(value);
  mutableRef.current = value;

  return mutableRef;
};

export default useMutableNebulaProp;
