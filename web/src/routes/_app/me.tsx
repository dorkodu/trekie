import { useQuery } from "@tanstack/react-query";
import { Flex } from "@web/components/ui/layout";
import { Text, Title } from "@web/components/ui/typography";
import { trekie } from "new/src/lib/trekie";
import { useEffect, useState } from "react";

export default function Me() {
  const user = trekie.use($ => $.user);

  const loading = false;

  if (loading) return "Loading...";

  return (
    <Flex className="flex flex-col m-4">
      <Title>Me</Title>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      {/* Add more profile details and self actions here */}
    </Flex>
  );
}
