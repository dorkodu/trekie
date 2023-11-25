import { createTheme } from "@mantine/core";
import { themeToVars } from "@mantine/vanilla-extract";

export const theme = createTheme({
  primaryColor: "green",
  defaultRadius: "md",
  cursorType: "pointer",

  fontFamily: "Rubik, Roboto, sans-serif",
  fontFamilyMonospace: "JetBrains Mono, Fira Code, monospace",
});

export const vars = themeToVars(theme);
