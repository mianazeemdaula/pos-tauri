import { LucideCircleArrowLeft, LucideCircleArrowRight } from 'lucide-react';
import { FC } from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
    onPage: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ page, totalPages, onNextPage, onPreviousPage, onPage }) => {
    return (
        <div className='flex items-center justify-between mt-4 border border-gray-200 rounded-md px-4 py-1 bg-gray-100'>
            <div className='flex items-center justify-center' >
                <button onClick={onPreviousPage} disabled={page === 1} className='text-gray-500'>
                    <LucideCircleArrowLeft />
                </button>
                <div className='flex text-sm'>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            className={`mx-1 bg-primary text-white size-6 rounded-full hover:bg-secondary transition-colors` + (page === index + 1 ? ' bg-secondary' : '')}
                            key={index + 1}
                            onClick={() => onPage(index + 1)}
                            disabled={page === index + 1}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button className='text-gray-500' onClick={onNextPage} disabled={page === totalPages}>
                    <LucideCircleArrowRight />
                </button>
            </div>

            <span className='text-sm'>
                Showing {page}-{totalPages}
            </span>
        </div>
    );
};

export default Pagination;