import Skeleton from "@mui/material/Skeleton";

type Props = {
  count: number;
};

export const LoadingSkeleton = ({ count }: Props) =>
  Array(count)
    .fill(0)
    .map((_, index) => <Skeleton height={35} key={index} />);
