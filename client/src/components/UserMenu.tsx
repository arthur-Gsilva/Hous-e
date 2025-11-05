import { useQuery } from "@tanstack/react-query";
import { AddAddressDialog } from "./AddAddressArea";
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { DropdownMenuSeparator } from "./ui/dropdown-menu"

import { LuTicket } from "react-icons/lu";
import { MdStarBorder } from "react-icons/md";
import { getAddress } from "@/services/address";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export const UserMenu = () => {

    const router = useRouter()
    const { user, logout } = useAuth();

    const { data: addresses } = useQuery({
        queryKey: ['address'],
        queryFn: getAddress,
        staleTime: Infinity
    })

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return(
        <div className="flex flex-col items-center ">
            {user?.admin === false &&
            <>
                <div>
                    <h6>Endereços</h6>

                    {addresses?.map((address) => (
                        <p key={address.id} className="text-center text-blue-400 my-4 hover:underline cursor-pointer">{address.street}</p>
                    ))}

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>+ Adiciona endereço</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <AddAddressDialog />
                        </DialogContent>
                    </Dialog>
                    
                </div>

                <DropdownMenuSeparator />

                
                    
                <Link href={'/pedidos'} className="flex items-center gap-3 p-3 hover:bg-gray-200 w-full transition-all duration-300 cursor-pointer">
                    <LuTicket className="text-primary text-2xl"/>
                    <h6>Meus Pedidos</h6>
                </Link>
                    

                <Link href={'/favoritos'}  className="flex items-center gap-3 p-3 hover:bg-gray-200 w-full transition-all duration-300 cursor-pointer">
                    <MdStarBorder className="text-primary text-2xl"/>
                    <h6>Meus Favoritos</h6>
                </Link>
            </>
            }

            {user?.admin === true &&
            <>
                <Link href={'/home'} className="flex items-center gap-3 p-3 hover:bg-gray-200 w-full transition-all duration-300 cursor-pointer">
                    <LuTicket className="text-primary text-2xl"/>
                    <h6>Produtos</h6>
                </Link>
                    

                <Link href={'/paineis'}  className="flex items-center gap-3 p-3 hover:bg-gray-200 w-full transition-all duration-300 cursor-pointer mb-3">
                    <MdStarBorder className="text-primary text-2xl"/>
                    <h6>Paineis</h6>
                </Link>
            </>
            }
            
        
            <div>
                <Button variant={'destructive'} onClick={() => handleLogout()}>Sair</Button>
            </div>
        </div>
    )
}