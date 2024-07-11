import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {useAuth} from "../../hooks/useAuth";
import Button from "@mui/material/Button";

export default function SignIn() {
    const { data: session } = useSession();
    const router = useRouter();
    const auth = useAuth()
    useEffect(() => {
        console.log('status',status); // Log the session and status to debug
        if (status === "authenticated") {
            router.push('/home/coupons');  // Redirect only if authenticated
        }
        if (session)
        {
            if(session?.user?.name) {
                session.user.role = 'admin'
            }
            localStorage.setItem('userData', JSON.stringify(session.user));
             auth.setUser(session.user);
            router.replace('/');
        }  // Redirect to home if logged in
    }, [session, router,auth]);

    return (
        <div>
            <Button
                size="large"
                variant="tonal"
                color="primary" onClick={() => signIn('google')}>Sign in with Elivaas Google Id</Button>
        </div>
    );
}
