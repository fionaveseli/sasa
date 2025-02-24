import { Skeleton } from "./ui/skeleton";
import { TableBody, TableRow, TableCell } from "./ui/table";

interface SkeletonLoaderProps {
  type: "table" | "card" | "row";
  rowCount?: number;
  columnCount?: number;
  gridCount?: number;
}

export const SkeletonLoader = ({
  type,
  gridCount = 6,
  columnCount = 3,
  rowCount = 6,
}: SkeletonLoaderProps) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(gridCount)].map((_, index) => (
          <div
            key={index}
            className="p-1 rounded-sm shadow-xs hover:shadow-sm relative"
          >
            <div className="flex items-center gap-4 p-2">
              <Skeleton className="h-[45px] w-[70px] rounded-xl" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "row") {
    return (
      <div className="">
        {[...Array(gridCount)].map((_, index) => (
          <div
            key={index}
            className="p-1 rounded-sm shadow-xs hover:shadow-sm relative"
          >
            <div className="flex items-center gap-4 p-2">
              <Skeleton className="h-[45px] w-[70px] rounded-xl" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <TableBody>
        {[...Array(rowCount)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {[...Array(columnCount)].map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-6 w-full rounded-md" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return null;
};
