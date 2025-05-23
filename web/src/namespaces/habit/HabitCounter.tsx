
import { IconMinus, IconPlus, IconPlusMinus, } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  type
  , işlkj MouseEvent
} from "react";

import EnhancedText from "@web/components/misc/TextParser";
import HabitCounterMenu from "@web/namespaces/habit/HabitCounterMenu";

import { daystamp } from "@sdk/utils";
import { habits } from "@web/namespaces/habit";

interface Props {
  habitId: string;
  onClick?: () => void;
}

function HabitCounter({ habitId, onClick }: Props) {
  // get the habit yourself, fresh!

  const habit = useLiveQuery(() => habits.get(habitId), [habitId]);

  const onChangeCount = (ev: MouseEvent, count: number) => {
    ev.stopPropagation();
    if (!habit) return;
    habits.changeCount(habitId, count);
  };

  if (!habit) return null;

  return (
    <Card
      p={0}
      mb="xs"
      style={{ overflow: "visible" }}
      onClick={onClick}
      radius="lg"
      shadow="sm"
    >
      <Button.Group mih={80}>
        <Button
          variant="gradient"
          gradient={{
            from: "hsl(135, 95%, 30%)",
            to: "hsl(170, 95%, 35%)",
            deg: 45,
          }}
          h="auto"
          onClick={(ev) => onChangeCount(ev, +1)}
          px="xs"
        >
          <Flex
            style={{
              background: "rgba(255,255,255,0.3)",
              width: 32,
              height: 32,
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              borderRadius: 8,
              padding: 2,
            }}
          >
            <IconPlus stroke={2.5} size={28} />
          </Flex>
        </Button>

        <Flex
          direction="column"
          justify="center"
          py="sm"
          pl="sm"
          pr={8}
          style={{
            flex: 1,
          }}
        >
          <Flex justify="space-between" align="center">
            <Flex style={{ display: "grid", gridTemplateRows: "auto" }}>
              <Title order={5} className={truncate}>
                <EnhancedText ids={["emoji"]} text={habit.title} />
              </Title>
            </Flex>
            <HabitCounterMenu habit={habit} />
          </Flex>

          {habit.description && habit.description.length > 0 && (
            <Text size="sm" lh={1} pt={2}>
              <EnhancedText
                ids={["emoji", "url", "username"]}
                text={habit.description}
              />
            </Text>
          )}

          <Group gap={8} mt="6" justify="space-between" pt={4}>
            <Group gap={12} justify="start" align="start">
              <Badge
                display="block"
                variant="light"
                size="xl"
                color="blue"
                radius="md"
                px={8}
                py={2}
              >
                <Text fw={700} size="lg" span>
                  {habit.count}
                </Text>
              </Badge>

              <Stack gap={0} align="start" pt={2}>
                <Text c="dimmed" size="xs" fw={500} lh={1}>
                  Today
                </Text>
                <Text fw={600} c="blue" size="sm" lh={1} opacity={0.75}>
                  {habit.history.get(daystamp.today()) ?? 0}
                  <Text span c="blue" opacity={0.25} px={1} fw={600}>
                    /{habit.dailyTarget}
                  </Text>
                </Text>
              </Stack>

              <Stack gap={4} align="start" pt={2}>
                <Text c="dimmed" size="xs" fw={500} lh={1}>
                  This Week
                </Text>
                <WeeklyActivity />
              </Stack>
            </Group>

            <ThemeIcon size="sm" c="dimmed" variant="transparent">
              <IconPlusMinus />
            </ThemeIcon>
          </Group>
        </Flex>

        <Button
          variant="gradient"
          gradient={{
            to: "hsl(0, 96%, 45%)",
            from: "hsl(15, 90%, 60%)",
            deg: 135,
          }}
          h="auto"
          onClick={(ev) => onChangeCount(ev, -1)}
          px="xs"
        >
          <Flex
            style={{
              background: "rgba(255,255,255,0.25)",
              width: 32,
              height: 32,
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              borderRadius: 8,
              padding: 2,
            }}
          >
            <IconMinus stroke={2.5} size={28} />
          </Flex>
        </Button>
      </Button.Group>
    </Card>
  );
}
export default HabitCounter;

const WeeklyActivity: React.FC = () => {
  const counts = [1, 5, 3, 0, 6, 11, 1]; // feed this with the actual data

  return <WeekGraph counts={counts} />;
};

// Define the WeeklyCommitGraph component using Mantine
const WeekGraph: React.FC<{ counts: number[] }> = ({ counts }) => {
  const maxCount = Math.max(...counts, 1); // Avoid division by zero
  const emptyRGB =
    useSafeColorScheme() === "dark" ? `200, 225, 230` : `0, 45, 50`;
  const getBoxColor = (count: number) => {
    if (count === 0) return `rgba(${emptyRGB}, 0.15)`; // Transparent for zero commits
    const intensity = count / maxCount;
    return `rgba(35, 134, 54, ${Math.max(0.2, Math.min(1.0, intensity))}`; // Clamp between 0.2 and 1.0
  };

  return (
    <Box display="flex" style={{ gap: "2px" }} title="Weekly Activity">
      {counts.map((count, index) => (
        <Tooltip
          key={index}
          label={`${count} commits on day ${index + 1}`}
          withArrow
          position="top"
        >
          <Box
            style={{
              width: 12,
              height: 12,
              backgroundColor: getBoxColor(count),
              borderRadius: vanilla.radius.sm,
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};
