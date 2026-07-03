import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

type Props = {
  count: number;
};

export const LoadingSkeleton = ({ count }: Props) => (
  <Box aria-label="Loading" role="status">
    {Array.from({ length: count }, (_, index) => (
      <Skeleton height={35} key={index} />
    ))}
  </Box>
);
