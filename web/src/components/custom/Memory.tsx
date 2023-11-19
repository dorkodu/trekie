import { useApiStore } from "@/stores/apiStore";
import { IMemory } from "@api/types/memory"
import { ActionIcon, Avatar, Card, Flex, Image, Text } from "@mantine/core"
import { IconDots, IconStar } from "@tabler/icons-react"
import TextParser from "../util/TextParser";
import { wrapContent } from "@/styles/shared.css";
import { util } from "@/lib/util";

interface Props {
  memory: IMemory;
}

function Memory({ memory }: Props) {
  const user = useApiStore(state => state.users[memory.userId]);

  return (
    <Card withBorder w={200}>

      <Card.Section>
        <Image
          src="https://i.pinimg.com/564x/80/12/d1/8012d171d4d5bcfea05ef04af626b3a3.jpg"
          alt="Image of a memory"
          w={200}
          h={150}
        />
      </Card.Section>

      <Flex direction="column" gap="xs" mt="md">

        <Text lineClamp={3} className={wrapContent}>
          <TextParser ids={["emoji", "url"]} text={memory.description} />
        </Text>

        <Flex gap="xs">
          <Avatar src="/favicon.svg" size={32} />
          <Flex direction="column">
            <Flex style={{ display: "grid", gridTemplateColumns: "auto" }}>
              <Text truncate><TextParser ids={["emoji"]} text={user?.name ?? ""} /></Text>
            </Flex>
            <Text size="sm" title={util.formatDate(memory.date, true)}>{util.relativeDate(memory.date)}</Text>
          </Flex>
        </Flex>

        <Flex justify="space-between" gap="xs">
          <Flex align="center" gap="xs">
            <ActionIcon variant="subtle"><IconStar /></ActionIcon>
            <Text>{memory.favourites}</Text>
          </Flex>
          <ActionIcon variant="subtle"><IconDots /></ActionIcon>
        </Flex>

      </Flex>

    </Card>
  )
}

export default Memory