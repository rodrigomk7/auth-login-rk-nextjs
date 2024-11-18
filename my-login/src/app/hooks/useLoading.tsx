import { useState } from "react";
interface LoaderState {
  isLoading: boolean;
  startLoading: () => void;
  finishLoading: () => void;
}

export function useLoading(): LoaderState {
  const [isLoading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };
  const finishLoading = () => {
    setLoading(true);
  };

  return {
    isLoading,
    startLoading,
    finishLoading
  };
}
