import { Divider, Flex, Text, Title } from "@mantine/core";
import WIPCard from "@web/components/cards/WIPCard";

function Premium() {
  return (
    <Flex direction="column" m="md">
      <Title size="h2" order={1}>
        Premium
      </Title>
      <Divider />
      <Text my={10}>Manage your Trekie Super subscription.</Text>
    </Flex>
  );
}

export default Premium;
