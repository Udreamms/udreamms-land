"use client";

import { useEffect, useState } from "react";

/**
 * iPhone, Android y iPad en modo táctil (hover fino ausente o puntero grueso).
 * iPad con teclado/ratón puede comportarse como escritorio (hover) — correcto.
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)");
    const touchOnly = window.matchMedia("(hover: none)");

    const update = () => {
      const hasTouchScreen = navigator.maxTouchPoints > 0;
      setIsTouch(
        coarsePointer.matches ||
          (touchOnly.matches && hasTouchScreen)
      );
    };

    update();
    coarsePointer.addEventListener("change", update);
    touchOnly.addEventListener("change", update);
    return () => {
      coarsePointer.removeEventListener("change", update);
      touchOnly.removeEventListener("change", update);
    };
  }, []);

  return isTouch;
}
