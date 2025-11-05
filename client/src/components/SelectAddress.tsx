import { Address } from "@/types/Address"
import { DialogTitle } from "./ui/dialog"

type props = {
    addresses: Address[] | undefined,
    selected: Address | null,
    setSelected: (a: Address) => void
}

export const SelectAddress = ({ addresses, selected, setSelected }: props) => {
    return(
        <div>
            <DialogTitle className="mb-4">Selecione o endereço</DialogTitle>
            {addresses?.map((address) => (
                <div 
                    key={address.id}
                    className="rounded-xl border-2 border-gray-300 mb-3 px-2 py-4 transition-all duration-300 hover:opacity-70 cursor-pointer"
                    style={{ borderColor:  selected?.id === address.id ? 'var(--primary)' : 'gray'}}
                    onClick={() => setSelected(address)}
                >
                    <div className="bg-gray-300 w-6 h-6 rounded-full flex justify-center items-center">
                        <div className={`${selected?.id === address.id ? 'bg-primary' : 'bg-transparent'} w-5 h-5 rounded-full`}></div>
                    </div>

                    <div>
                        <h3>{address.street}, {address.number}</h3>
                        <h4>{address.zipcode}</h4>
                    </div>
                </div>
            ))}
        </div>
    )
}