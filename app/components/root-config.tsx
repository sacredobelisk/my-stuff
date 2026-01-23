import { type PropsWithChildren } from "react";

import { ConfigProvider, type ThemeConfig } from "antd";

const theme: ThemeConfig = {
  components: {
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
