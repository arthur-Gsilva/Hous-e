'use client'

import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { useCart } from "@/contexts/CartContext";
import { Cart } from "./Cart";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { UserMenu } from "./UserMenu";
import { SearchInput } from "./ui/SearchInput";

export const Header = () => {

    const { state } = useCart();

    return(
        <header className="bg-[#252525]">
            <div className="w-full max-w-7xl mx-auto p-6 text-white flex items-center justify-between">
                
                <Link href={'/home'} 
                    className="text-3xl text-primary font-bold font-sans cursor-pointer"
                    >HE
                </Link>
                
                <div className="flex items-center gap-10 ">
                    <SearchInput />

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <FaRegUserCircle className="cursor-pointer text-2xl text-primary"/>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <UserMenu />
                        </DropdownMenuContent>
                        
                    </DropdownMenu>
                    

                    <Drawer direction="right" >
                        <DrawerTrigger className="relative">
                            <TiShoppingCart className="cursor-pointer text-2xl text-primary"/>
                            {state.items.length > 0 &&
                                <div className="text-xs w-4 h-4 rounded-full flex items-center justify-center text-center bg-primary absolute -top-4 -right-4">
                                    {state.items.length}
                                </div>
                            }
                        </DrawerTrigger>

                        <DrawerContent>
                            <Cart />
                        </DrawerContent>
                    </Drawer>
                    
                </div>
            </div>
        </header>
    )
}