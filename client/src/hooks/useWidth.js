import { useTheme } from "@material-ui/styles";

import { useMediaQuery } from "@material-ui/core";

export default function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      const matches = useMediaQuery(
        theme.breakpoints.up(key)
      );
      return !output && matches ? key : output;
    }, null) || "xs"
  );
}
