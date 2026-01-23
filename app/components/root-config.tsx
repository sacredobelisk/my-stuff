import { type PropsWithChildren } from "react";

import { ConfigProvider, type ThemeConfig } from "antd";

const theme: ThemeConfig = {
  components: {
    Typography: {
      // titleMarginBottom: 0,
      // titleMarginTop: 0,
    },
    Layout: {
      bodyBg: "#fff",
      paddingContentHorizontal: 240,
      headerBg: "#eee",
      headerHeight: "auto",
      siderBg: "#fff",
    },
  },
};

export const RootConfig = ({ children }: PropsWithChildren) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
