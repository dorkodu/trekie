import Footer from "@/components/custom/Footer";
import { Button, Card, DefaultMantineColor, Divider, Flex, Image, ScrollArea, Text, ThemeIcon, Title } from "@mantine/core";
import { IconBuildingStore, IconChecklist, IconNotebook, IconRoad, IconTargetArrow, IconUsers } from "@tabler/icons-react";
import { Navigate, Route, Routes } from "react-router-dom";

function Join() {
  return (
    <Flex
      direction="column" justify="center" gap="md" p="md" mx="auto"
      pos="absolute" top={0} bottom={0} left={0} right={0} maw={360}
    >

      <Flex justify="center">
        <Image src="/trekie-mascot.svg" alt="the Mascot of Trekie" w={100} h={100} />
      </Flex>

      <Title ta="center" order={2}>
        The Gamified Digital Life Companion
      </Title>

      <Card withBorder>

        <ScrollArea offsetScrollbars="y" type="always" h={300}>

          <Flex direction="column" gap="md">

            <Routes>
              <Route index element={<Index />} />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/join" />} />
            </Routes>

          </Flex>

        </ScrollArea>

      </Card>


      <Divider />

      <Footer />

    </Flex>
  )
}

export default Join

function Index() {
  const items: JoinPointProps[] = [
    { icon: <IconRoad />, color: "green", text: "Momentum, xp, and streaks... Add a little fun to your life." },
    { icon: <IconUsers />, color: "indigo", text: "Join communities, and see what your friends are doing." },
    { icon: <IconChecklist />, color: "blue", text: "Keep track of your habits, daily." },
    { icon: <IconTargetArrow />, color: "cyan", text: "Define yourself clear goals and achieve them." },
    { icon: <IconNotebook />, color: "grape", text: "Save the memories you gain along the way." },
    { icon: <IconBuildingStore />, color: "lime", text: "View the marketplace of ideas and find new meanings to your life." },
  ]

  return (
    <>
      <Button>
        <Title order={5}>Join Trekie</Title>
      </Button>

      {items.map(item => <JoinPoint key={item.text} {...item} />)}

      <Button>
        <Title order={5}>Let's Start</Title>
      </Button>
    </>
  )
}

interface JoinPointProps {
  icon: React.ReactNode;
  color: DefaultMantineColor;
  text: string;
}

function JoinPoint({ icon, color, text }: JoinPointProps) {
  return (
    <Flex align="center" gap="md">
      <ThemeIcon variant="light" size={32} color={color}>
        {icon}
      </ThemeIcon>
      <Text>{text}</Text>
    </Flex>
  )
}