import { Skeleton } from '../ui/skeleton';

const InputSkeleton = () => (
    <div className="grid grid-cols-3 gap-x-4">
        <Skeleton className="h-[66px]" />
        <Skeleton className="h-[66px]" />
        <Skeleton className="h-[66px]" />
    </div>
);

const ConversionSkeleton = () => (
    <div>
        <Skeleton className="h-[15px] w-[160px] mb-1" />
        <Skeleton className="h-[35px] w-[204px]" />
    </div>
);

export { InputSkeleton, ConversionSkeleton };
