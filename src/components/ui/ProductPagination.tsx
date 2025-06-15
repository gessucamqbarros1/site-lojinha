
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

type ProductPaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  showNumbers?: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
  showNumbers = true,
}) => {
  if (totalPages <= 1) return null;

  // Mostrar sempre as páginas próximas
  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        totalPages
      );
    }
    // Remover duplicatas
    return Array.from(new Set(pages)).filter((p) => p >= 1 && p <= totalPages);
  };

  const pages = getPages();

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            asChild
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
            onClick={() => onChange(clamp(currentPage - 1, 1, totalPages))}
          />
        </PaginationItem>

        {showNumbers && pages.map((page, i) => (
          <React.Fragment key={page}>
            {i > 0 && page - pages[i - 1] > 1 && (
              <PaginationItem>
                <span className="px-2 text-gray-400">...</span>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === page}
                aria-label={`Página ${page}`}
                onClick={() => onChange(page)}
                tabIndex={currentPage === page ? -1 : 0}
                asChild
              >
                <button
                  type="button"
                  className={currentPage === page ? "font-bold" : ""}
                >
                  {page}
                </button>
              </PaginationLink>
            </PaginationItem>
          </React.Fragment>
        ))}

        <PaginationItem>
          <PaginationNext
            asChild
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
            onClick={() => onChange(clamp(currentPage + 1, 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProductPagination;

