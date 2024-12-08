import React from "react";
import { Button } from "@/components/ui/button"; // Import button từ ShadCN UI
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleDoubleRight, FaAngleRight } from "react-icons/fa";

const PaginationAdmin = ({ total, page, onChange }) => {
    const handlePrevPage = () => {
        if (page > 1) onChange(page - 1);
    };

    const handleNextPage = () => {
        if (page < total) onChange(page + 1);
    };

    const handleFirstPage = () => {
        if (page !== 1) onChange(1);
    };

    const handleLastPage = () => {
        if (page !== total) onChange(total);
    };

    return (
        <div className="flex items-center gap-2 text-gray-600">
            {/* First Page */}
            <Button
                variant="outline"
                size="icon"
                onClick={handleFirstPage}
                disabled={page === 1}
                className="disabled:text-gray-300"
            >
                <FaAngleDoubleLeft />
            </Button>

            {/* Previous Page */}
            <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={page === 1}
                className="disabled:text-gray-300"
            >
                <FaAngleLeft />
            </Button>

            {/* Current Page */}
            <span className="px-4 py-1 text-sm font-medium text-gray-700 border rounded">
                {page}/{total}
            </span>

            {/* Next Page */}
            <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={page === total}
                className="disabled:text-gray-300"
            >
                <FaAngleRight />
            </Button>

            {/* Last Page */}
            <Button
                variant="outline"
                size="icon"
                onClick={handleLastPage}
                disabled={page === total}
                className="disabled:text-gray-300"
            >
                <FaAngleDoubleRight />
            </Button>
        </div>
    );
};

export default PaginationAdmin;
