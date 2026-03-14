import { useState, useRef, useCallback, useEffect } from "react";

export default function useSimPlayback(totalSteps, speed = 1) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(-1);
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const step = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= totalSteps - 1) return prev;
      return prev + 1;
    });
  }, [totalSteps]);

  const reset = useCallback(() => {
    stop();
    setCurrentStep(-1);
  }, [stop]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            stop();
            return prev;
          }
          return prev + 1;
        });
      }, 600 / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, totalSteps, stop]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  return {
    currentStep,
    isPlaying,
    play,
    pause,
    step,
    reset,
    togglePlayPause,
    setCurrentStep,
  };
}
