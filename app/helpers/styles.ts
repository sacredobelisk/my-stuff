import type { SxProps, Theme } from "@mui/material/styles";

/** Hides content visually while leaving it available to screen readers. */
export const visuallyHidden: SxProps<Theme> = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
};

/** A skip link: hidden until focused, then pinned to the top-left of the viewport. */
export const skipLinkSx: SxProps<Theme> = {
  ...visuallyHidden,
  "&:focus-visible": {
    backgroundColor: "background.paper",
    border: 1,
    borderColor: "divider",
    borderRadius: 1,
    clip: "auto",
    height: "auto",
    left: 8,
    margin: 0,
    overflow: "visible",
    padding: 1,
    position: "fixed",
    top: 8,
    whiteSpace: "nowrap",
    width: "auto",
    zIndex: "tooltip",
  },
};
