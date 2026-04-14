import { useEffect, useRef } from "react";

export function useOutsideClick<T extends Element>(
  handler: () => void,
  listenCapturing: boolean = true,
) {
  const componentRef = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        componentRef.current &&
        !componentRef.current?.contains(e.target as Node) &&
        !document.getElementById("modal-root")?.hasChildNodes()
      )
        handler();
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () => document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return componentRef;
}
