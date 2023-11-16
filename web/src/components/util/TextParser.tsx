
import urlRegexp from "url-regex";
import emojiRegexp from "emoji-regex";
import React, { useMemo } from "react";
import Emoji from "../Emoji";
import { Anchor } from "@mantine/core";

const urlRegex = urlRegexp();
const emojiRegex = emojiRegexp();

type TextParserTypeId = keyof typeof textParserTypes;
const textParserTypes = {
  url: {
    regex: urlRegex,
    component: ({ text }: { text: string }) => <Anchor href={text} target="_blank">{text}</Anchor>
  },
  emoji: {
    regex: emojiRegex,
    component: ({ text }: { text: string }) => <Emoji emoji={text} />
  },
}

interface Props {
  text: string;
  types?: Array<TextParserTypeId>;
}

function TextParser({ text, types }: Props) {
  const parserTypes = useMemo(() => {
    const out: TextParserTypeId[] = [];

    Object.keys(textParserTypes).forEach((id) => {
      if (types?.includes(id as any)) out.push(id as any);
    });

    return out;
  }, [types]);

  const elements = useMemo(() => {
    const out = [];
    let matches: Array<{ index: number, text: string, id: TextParserTypeId }> = [];

    parserTypes.forEach(id => {
      let match: RegExpExecArray | null;
      while (match = textParserTypes[id].regex.exec(text)) {
        matches.push({ index: match.index, text: match[0], id });
      }
    });

    matches = matches.sort((a, b) => a.index - b.index);

    for (let i = 0, key = 0; i < text.length;) {
      const match = matches.shift();
      if (match && match.index < i) continue;

      if (match) {
        const diff = match.index - i;
        if (diff > 0) {
          out.push(<React.Fragment key={key++} >{text.substring(i, i + diff)}</React.Fragment>);
          i += diff;
        }

        const Component = textParserTypes[match.id].component;
        out.push(<Component key={key++} text={match.text} />)
        i += match.text.length;
      }
      else {
        out.push(<React.Fragment key={key++}>{text.substring(i)}</React.Fragment>);
        break;
      }
    }

    return out;
  }, [text, types]);

  return <>{elements}</>;
}

export default TextParser