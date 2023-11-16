
import urlRegexp from "url-regex";
import emojiRegexp from "emoji-regex";

const urlRegex = urlRegexp();
const emojiRegex = emojiRegexp();

const types = {
  url: { regex: urlRegex, component: (text: string) => <>{text}</> },
  emoji: { regex: emojiRegex, component: (text: string) => <>{text}</> },
}

interface Props {
  types?: Array<keyof typeof types>;
}

function TextParser({ children }: React.PropsWithChildren<Props>) {
  return <>{children}</>;
}

export default TextParser