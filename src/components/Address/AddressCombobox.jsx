import React, { useState, useEffect, useCallback } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash.debounce";

const AddressCombobox = ({
    level = "province",
    parentId = "",
    value,
    onChange,
    disabled = false,
    placeholder = "Chọn...",
    getLabel = (val) => val, // hàm lấy label để hiển thị từ value
}) => {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Fetch data giống bạn
    const fetchItems = async (keyword) => {
        if (disabled) {
            setItems([]);
            return;
        }
        setLoading(true);
        try {
            let data = [];
            if (level === "province") {
                data = await apiAddress.getProvinces(keyword);
            } else if (level === "district") {
                if (!parentId) data = [];
                else data = await apiAddress.getDistricts(parentId, keyword);
            } else if (level === "ward") {
                if (!parentId) data = [];
                else data = await apiAddress.getWards(parentId, keyword);
            }
            setItems(data);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useCallback(
        debounce((keyword) => {
            fetchItems(keyword);
        }, 300),
        [level, parentId, disabled]
    );

    useEffect(() => {
        if (open) {
            debouncedFetch(query);
        }
    }, [query, debouncedFetch, open]);

    useEffect(() => {
        if (!disabled && open) {
            fetchItems("");
        } else {
            setItems([]);
        }
    }, [level, parentId, disabled, open]);

    const handleSelect = (selectedValue) => {
        onChange(selectedValue);
        setQuery("");
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                    disabled={disabled}
                >
                    {value ? getLabel(value) : placeholder}
                    <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Tìm kiếm..."
                        value={query}
                        onValueChange={setQuery}
                        autoFocus
                        className="h-9"
                    />
                    <CommandList>
                        {loading && (
                            <div className="p-2 text-center text-gray-500">Đang tải...</div>
                        )}
                        {!loading && items.length === 0 && <CommandEmpty>Không có kết quả</CommandEmpty>}
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item}
                                    value={item}
                                    onSelect={(currentValue) => handleSelect(currentValue)}
                                >
                                    {getLabel(item)}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === item ? "opacity-100" : "opacity-0"
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

export default AddressCombobox;
