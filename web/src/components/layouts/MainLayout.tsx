import { Button, Flex, Image, Title, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  console.log(isMobile);

  return (
    <Flex direction="column" gap="md" p="md">

      <Flex align="center" justify="space-between">
        <Flex align="center" gap="md">
          <Image src="/favicon.svg" w={40} h={40} />
          <Title order={4}>Trekie</Title>
        </Flex>

        <Button.Group>
          <Button variant="default">Services</Button>
          <Button variant="default">About</Button>
          <Button variant="default">FAQ</Button>
        </Button.Group>

        <Button>Contact Us</Button>
      </Flex>

      <Outlet />

    </Flex>
  )
}

export default MainLayout