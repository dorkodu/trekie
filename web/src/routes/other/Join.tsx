import Footer from "@/components/custom/Footer";
import { useApiStore } from "@/stores/apiStore";
import { IUser } from "@api/types/user";
import { Button, DefaultMantineColor, Divider, Flex, Image, Modal, PasswordInput, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconBuildingStore, IconChecklist, IconNotebook, IconRoad, IconTargetArrow, IconUsers } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function Join() {
  const [signupOpened, { open: signupOpen, close: signupClose }] = useDisclosure(false);
  const [loginOpened, { open: loginOpen, close: loginClose }] = useDisclosure(false);

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
      <Flex direction="column" justify="center" p="md" mx="auto" mih="100%" maw={360}>
        <Flex direction="column" gap="md">

          <Flex justify="center">
            <Image src="/trekie-mascot.svg" alt="the Mascot of Trekie" w={100} h={100} />
          </Flex>

          <Title ta="center" order={2}>
            The Gamified Digital Life Companion
          </Title>

          <Button onClick={signupOpen}>
            <Title order={5}>Signup</Title>
          </Button>

          <Button onClick={loginOpen} variant="default">
            <Title order={5}>Login</Title>
          </Button>

          {items.map(item => <JoinPoint key={item.text} {...item} />)}

          <Divider />

          <Footer />

        </Flex>
      </Flex>

      <SignupModal opened={signupOpened} onClose={signupClose} />
      <LoginModal opened={loginOpened} onClose={loginClose} />
    </>
  )
}

export default Join

function SignupModal(props: { opened: boolean, onClose: () => void }) {
  const navigate = useNavigate();

  const [username, setUsername] = useInputState("");
  const [email, setEmail] = useInputState("");
  const [password, setPassword] = useInputState("");

  const signup = () => {
    const user: IUser = {
      id: Date.now().toString(),
      username,
      name: username,
      email,
      bio: "",
      joinDate: Date.now(),
      totalXp: 0,
      dailyXpCurrent: 0,
      dailyXpTarget: 0,
      lastXpDate: 0,
      streaks: 0,
      lastStreakDate: 0,
      followerCount: 0,
      followingCount: 0,
      premium: false,
    }

    useApiStore.getState().auth(user);
    navigate("/home");
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      lockScroll={false}
      centered
      size={360}
      title="Signup to Trekie"
    >
      <Flex direction="column" gap="md">

        <TextInput
          value={username} onChange={setUsername}
          label="Username"
        />

        <TextInput
          value={email} onChange={setEmail}
          label="Email"
          type="email"
        />

        <PasswordInput
          value={password} onChange={setPassword}
          label="Password"
        />

        <Button onClick={signup}>Let's Start!</Button>

      </Flex>
    </Modal>
  )
}

function LoginModal(props: { opened: boolean, onClose: () => void }) {
  const [info, setInfo] = useInputState("");
  const [password, setPassword] = useInputState("");

  const login = () => {
    // TODO: Implement login
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      lockScroll={false}
      centered
      size={360}
      title="Login to Trekie"
    >
      <Flex direction="column" gap="md">

        <TextInput
          value={info} onChange={setInfo}
          label="Username or Email"
        />

        <PasswordInput
          value={password} onChange={setPassword}
          label="Password"
        />

        <Button onClick={login}>Login</Button>

      </Flex>
    </Modal>
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