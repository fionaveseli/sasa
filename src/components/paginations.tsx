import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "./ui/pagination";

interface PaginationsProps {
  page: number;
  handlePage?: (page: number) => void;
  numbers: number[];
  totalPages: number;
}

export default function Paginations({
  page,
  handlePage,
  numbers,
  totalPages,
}: PaginationsProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {page === 0 ? (
            <PaginationPrevious className="cursor-not-allowed" aria-disabled />
          ) : (
            <PaginationPrevious
              onClick={() => handlePage && handlePage(page - 1)}
              className="cursor-pointer"
            />
          )}
        </PaginationItem>
        {page > 1 && (
          <PaginationItem aria-disabled>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {numbers.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePage && handlePage(number - 1)}
              isActive={number === page + 1}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page + 2 < totalPages && (
          <PaginationItem aria-disabled>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          {page + 1 === totalPages ? (
            <PaginationNext className="cursor-not-allowed" aria-disabled />
          ) : (
            <PaginationNext
              onClick={() => handlePage && handlePage(page + 1)}
              className="cursor-pointer"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
