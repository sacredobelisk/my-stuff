import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState, type PropsWithChildren } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Nav, NAV_DRAWER_ID } from "~/components/nav/nav";
import { GlobalProviders } from "~/components/providers";
import { skipLinkSx } from "~/helpers/styles";
import type { Route } from "./+types/root";

import "./app.css";

export const links: Route.LinksFunction = () => [
  { href: "https://fonts.googleapis.com", rel: "preconnect" },
  {
    crossOrigin: "anonymous",
    href: "https://fonts.gstatic.com",
    rel: "preconnect",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
    rel: "stylesheet",
  },
];

const DRAWER_WIDTH = 240;
const MAIN_CONTENT_ID = "main-content";

const LayoutContent = ({ children }: PropsWithChildren) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Link href={`#${MAIN_CONTENT_ID}`} sx={skipLinkSx}>
        Skip to main content
      </Link>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            aria-controls={NAV_DRAWER_ID}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Each page owns its own <h1>, so the site title here is presentational. */}
          <Typography component="div" variant="h1" noWrap>
            Sean OBrien
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Nav drawerWidth={DRAWER_WIDTH} mobileOpen={mobileOpen} onDrawerClose={handleDrawerToggle} />
        <Box component="main" id={MAIN_CONTENT_ID} sx={{ flexGrow: 1, p: 2 }} tabIndex={-1}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export const Layout = ({ children }: PropsWithChildren) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      <GlobalProviders>
        <LayoutContent>{children}</LayoutContent>
      </GlobalProviders>
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  // Rendered inside the layout's <main>, so this must not introduce a second landmark.
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h2">
        {message}
      </Typography>
      <Typography>{details}</Typography>
      {stack && (
        <Box component="pre" sx={{ backgroundColor: "action.hover", borderRadius: 1, overflowX: "auto", p: 2 }}>
          <code>{stack}</code>
        </Box>
      )}
    </Stack>
  );
};
