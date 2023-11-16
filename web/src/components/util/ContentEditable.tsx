import { useLayoutEffect, useRef } from "react"
import classes from "./ContentEditable.module.css";

interface Props {

}

function ContentEditable({ }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const onPaste = (ev: ClipboardEvent) => {
      ev.preventDefault()
      const text = ev.clipboardData?.getData("text/plain");
      document.execCommand("insertText", false, text);
    }

    const onCleanup = () => {
      if (!ref.current) return;
      if (ref.current.textContent?.length) return;

      while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);
    }

    ref.current.addEventListener("paste", onPaste);
    ref.current.addEventListener("keyup", onCleanup);
    return () => {
      ref.current?.removeEventListener("paste", onPaste);
      ref.current?.removeEventListener("keyup", onCleanup);
    }
  }, []);

  return (
    <div
      className={classes.input}
      ref={ref}
      contentEditable
      placeholder="test"
      style={{ whiteSpace: "pre-wrap", outline: "none" }}
    />
  )
}

export default ContentEditable