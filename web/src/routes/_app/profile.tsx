import { USERHANDLE_REGEX } from "@sdk/core";
import { useLocation } from "@tanstack/react-router";
import { Stack } from "@web/components/ui/layout";
import { Text } from "@web/components/ui/typography";
import { Profile } from "@web/namespaces/social/profile/Profile";

export default function Page() {
  const location = useLocation();
  const username = location.pathname.slice(2); // '/@username' => 'username'
  let result;

  const handleRegexMatch = location.pathname.match(USERHANDLE_REGEX);

  if (handleRegexMatch) {
  }

  !username ? <Text>User not found.</Text> : <Profile username={username} />;

  return (
    <div className="flex flex-col items-center justify-center gap-0.5 m-2">
      {result}
    </div>
  );
}
