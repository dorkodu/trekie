import { useMemo } from "react";
import twemoji from "twemoji";
import classes from "./Emoji.module.css";

function Emoji({ emoji, ...props }: React.ComponentPropsWithoutRef<"img"> & { emoji: string }) {
  const src = useMemo(() => {
    const element = document.createElement("div");
    element.innerHTML = twemoji.parse(
      emoji,
      { ext: ".svg", folder: "svg", base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/" }
    );
    return (element.firstChild as HTMLImageElement).src;
  }, [emoji]);

  return (
    <img
      src={src}
      className={classes.emoji}
      alt={emoji}
      draggable={false}
      {...props}
    />
  )
}

export default Emoji