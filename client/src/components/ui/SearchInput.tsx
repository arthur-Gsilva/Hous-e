'use client'

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { CiSearch } from "react-icons/ci"


export const SearchInput = () => {

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputRef.current?.value) {
            router.push(`/search?query=${encodeURIComponent(inputRef.current.value)}`);
            inputRef.current.value = "";
        }

        
    };

    return(
        <div className="border-2 border-gray-400 transition-all duration-300 focus-within:border-primary flex items-center gap-3 p-2 min-w-80 rounded-md">
            <CiSearch />
            <input 
                className="border-none outline-0 flex-1"
                placeholder="O que você procura?"
                onKeyDown={handleKeyDown}
                ref={inputRef}
            />
        </div>
    )
}