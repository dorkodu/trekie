import { useQuery } from "@tanstack/react-query";
import { Flex } from "@web/components/ui/flex";
import { trekie } from "new/src/lib/trekie";
import { useEffect, useState } from "react";

export default function Me() {
  const selfUser = trekie.use($ => $.user);

  const loading = false;

  if (loading) return "Loading...";

  return (
    <Flex direction="column" m="md">
      <Title>Me</Title>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      {/* Add more profile details and self actions here */}
    </Flex>
  );
}
