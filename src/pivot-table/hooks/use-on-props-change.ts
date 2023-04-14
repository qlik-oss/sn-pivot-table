import { useState } from "react";

// Act as a wrapper for https://beta.reactjs.org/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
export default function useOnPropsChange<T>(callback: () => void, props: T[]) {
  const [prev, setPrev] = useState<T[]>(props);
  const hasChanged = prev.some((prevProp, index) => prevProp !== props[index]);

  if (hasChanged) {
    setPrev(props);
    callback();
  }
}
