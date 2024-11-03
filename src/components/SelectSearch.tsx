import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SelectItem = {
    label: string;
    value: string;
};

const SelectSearch = ({
    items,
    onValueChange,
    placeholder,
    value,
    className,
}: {
    items: SelectItem[];
    onValueChange: (currentValue: string) => void;
    value: string;
    placeholder?: string;
    className?: string;
}) => {
    const [open, setOpen] = useState(false);

    const handleItemSelect = (currentValue: string) => {
        setOpen(false);

        if (onValueChange) {
            onValueChange(currentValue);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between py-8 text-lg ${className}`}
                >
                    {value
                        ? items.find((item) => item.value === value)?.label
                        : placeholder
                        ? placeholder
                        : 'Select an option'}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search" className="h-9" />
                    <CommandList>
                        <CommandEmpty>No items found</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={() =>
                                        handleItemSelect(item.value)
                                    }
                                >
                                    {item.label}
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            value === item.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export { SelectSearch };
