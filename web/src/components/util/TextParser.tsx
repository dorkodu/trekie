import React, { useMemo } from "react";
import { Anchor } from "@mantine/core";
import Emoji from "../Emoji";
import urlRegexp from "url-regex";
import emojiRegexp from "emoji-regex";

const urlRegex = urlRegexp();
const emojiRegex = emojiRegexp();

const textParserTypes = {
  url: {
    regex: urlRegex,
    component: ({ text }: { text: string }) => <Anchor href={text} target="_blank">{text}</Anchor>
  },
  emoji: {
    regex: emojiRegex,
    component: ({ text }: { text: string }) => <Emoji emoji={text} />
  },
};

type TextParserTypeId = keyof typeof textParserTypes;

interface Props {
  text: string;
  types?: Array<TextParserTypeId>;
}

function TextParser({ text, types }: Props) {
  const parserTypes = useMemo(() => {
    return types?.filter(type => textParserTypes[type]) || [];
  }, [types]);

  const elements = useMemo(() => {
    const matches = parserTypes.flatMap(id => {
      return Array.from(text.matchAll(textParserTypes[id].regex), match => ({ index: match.index || 0, text: match[0], id }));
    });

    const sortedMatches = matches.sort((a, b) => a.index - b.index);

    let currentIndex = 0;
    let key = 0;

    const out = sortedMatches.flatMap(match => {
      const diff = match.index - currentIndex;
      const i = currentIndex;
      currentIndex += diff + match.text.length;

      const Component = textParserTypes[match.id].component;

      return [
        diff > 0 && <React.Fragment key={key++}>{text.substring(i, i + diff)}</React.Fragment>,
        <Component key={key++} text={match.text} />
      ];
    });

    if (currentIndex < text.length) {
      out.push(<React.Fragment key={key++}>{text.substring(currentIndex)}</React.Fragment>);
    }

    return out;
  }, [text, types]);

  return <>{elements}</>;
}

export default TextParser;