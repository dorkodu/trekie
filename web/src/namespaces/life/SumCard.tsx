import { Box, Center, Group, Paper, Stack, Text, useMantineColorScheme } from "@mantine/core"
import { useThemed } from "@web/shared/hooks"
import { vanilla } from "@web/styles/theme"

export function SumCard({
  icon,
  value,
  subtext,
  color,
  kind
}: {
  icon: React.ReactNode
  value: number
  color: string
  kind?: string
  subtext?: string
}) {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper style={{
      padding: 0,
      background: vanilla.colors[color]?.light,
      border: `2px solid ${vanilla.colors[color]?.lightHover}`,
      boxShadow: `0px 3px 0px 0px ${vanilla.colors[color]?.light}`,
    }}>
      <Group wrap="nowrap" gap={0} justify="space-between">

        <Stack gap={4} px={6} py={6} pt={8}>
          <Group gap={4}>
            <Text span lh={0.75} fw={800} c={colorScheme == 'dark' ? vanilla.colors.white : vanilla.colors.black}
              style={{ textShadow: `1px 1px 2px ${useThemed({ dark: "#111", light: "#fff" })}` }}>
              {value}
            </Text>
            {subtext && <Text span fz={12.5} lh={0.75} fw={500} c={colorScheme == 'dark' ? vanilla.colors.white : vanilla.colors.black}
              style={{ textShadow: `1px 1px 2px ${useThemed({ dark: "#111", light: "#fff" })}` }}>
              {subtext}
            </Text>}
          </Group>

          <Text
            tt="uppercase"
            c={vanilla.colors[color]?.filled}
            fw={700}
            size="11"
            lh={1}
          >
            {kind}
          </Text>
        </Stack>
        <Box pr={6}>
          <Center>{icon}</Center>
        </Box>
      </Group>
    </Paper>
  )
}
