import Footer from '#/components/custom/Footer'
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core'

export default function Welcome() {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Stack>
      <SimpleGrid cols={{ base: 1, sm: 2 }}></SimpleGrid>
      <div>It works</div>
      <div>features</div>
      <div>call to action</div>
      <div>premium</div>
      <div>why</div>
      <div>other products / dorkodu</div>
      <div>last call</div>
    </Stack>
  )
}

const Header = () => {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper withBorder>
      <Flex justify="center">
        <Image
          src={
            colorScheme == 'light'
              ? '/images/trekie_Brand.svg'
              : '/images/trekie_Brand_White.svg'
          }
          h={100}
          w="auto"
        />
      </Flex>
    </Paper>
  )
}

const Hero = (
  <Paper withBorder>
    <Title>Hero</Title>
    <Text>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
      distinctio.
    </Text>
  </Paper>
)

const ItWorks = (
  <Paper withBorder>
    <Title>It Works!</Title>
    <Text>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio nulla ullam
      voluptas nemo voluptatibus tempora facere nobis architecto, id harum,
      adipisci eaque provident corrupti molestias?
    </Text>
  </Paper>
)

const Features = (
  <Paper withBorder>
    <Title>Features</Title>
    <Text>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio nulla ullam
      voluptas nemo voluptatibus tempora facere nobis architecto, id harum,
      adipisci eaque provident corrupti molestias?
    </Text>

    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </SimpleGrid>
  </Paper>
)
