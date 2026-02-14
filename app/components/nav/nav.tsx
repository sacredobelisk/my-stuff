import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink } from "react-router";

type Props = {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerClose: () => void;
};

const navItems = [
  { icon: <HomeOutlinedIcon />, label: "Home", to: "/" },
  { icon: <ReceiptLongOutlinedIcon />, label: "Bill Calculator", to: "/bill-calculator" },
  { icon: <WorkOutlineOutlinedIcon />, label: "Resume", to: "/resume" },
  { icon: <CasinoOutlinedIcon />, label: "Board Game 10x10", to: "/10x10" },
];

const DrawerContent = ({ onItemClick }: { onItemClick?: () => void }) => (
  <List>
    {navItems.map((item) => (
      <ListItem key={item.to} disablePadding>
        <ListItemButton
          component={NavLink}
          to={item.to}
          onClick={onItemClick}
          sx={{
            "&.active": {
              backgroundColor: "action.selected",
              "& .MuiListItemIcon-root": {
                color: "primary.main",
              },
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);

export const Nav = ({ drawerWidth, mobileOpen, onDrawerClose }: Props) => {
  return (
    <Box aria-label="Main navigation" component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile drawer - temporary, controlled by state */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <DrawerContent onItemClick={onDrawerClose} />
      </Drawer>
      {/* Desktop drawer - permanent, always visible */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          height: "100%",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            position: "relative",
          },
        }}
        open
      >
        <DrawerContent />
      </Drawer>
    </Box>
  );
};
