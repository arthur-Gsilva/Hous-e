import { ReactNode } from "react"
import { Checkbox } from "./ui/checkbox"

type Props = {
    label: string,
    children: ReactNode
}

export const FilterCheckboxItem  = ({ label, children }: Props) => {
    return(
        <div className="border-b border-b-gray-300 pb-6 mb-8">
            <h4 className="mb-4">{label}</h4>

            {children}
        </div>
    )
}