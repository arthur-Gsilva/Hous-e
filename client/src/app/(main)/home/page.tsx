'use client'

import { AdminHome } from "@/components/AdminHome";
import { Home } from "@/components/Home"
import { LeftBar } from "@/components/LeftBar"
import { useAuth } from "@/contexts/AuthContext";


const page = () => {
    
    const { user } = useAuth();

    if (!user) return null;

    return(
        <div  className="w-full max-w-7xl mx-auto p-6 flex flex-1">
            {user?.admin === false &&
                <>
                    <LeftBar />

                    <Home />
                </>
            }

            {user?.admin === true &&
                <AdminHome />
            }
            
        </div>
    )
}

export default page