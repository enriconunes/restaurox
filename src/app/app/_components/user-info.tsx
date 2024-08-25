'use client'

import { Button } from "@/components/ui/button";
import { Session } from "next-auth"
import { signOut } from "next-auth/react";

type Props = {
    user: Session['user']
}

export default function UserInfo({user}: Props){

    if(!user) return;

    return(
        <div>
            {user.email}
            <Button onClick={() => signOut()}>
                SignOut
            </Button>
        </div>
    )

}