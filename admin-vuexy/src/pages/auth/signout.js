import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {useAuth} from "../../hooks/useAuth";

const Signout = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const auth = useAuth()

    useEffect(() => {
        // Ensure there's a session before trying to sign out
        if (session) {
            localStorage.removeItem('userData');
            auth.setUser(null);
            signOut({ redirect: false }).then(() => {
                // Redirect to home or login page post sign out
                router.replace('/');
            });
        } else {
            // If no session, redirect directly
            router.replace('/');
        }
    }, [session, router,auth]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>Signing out...</p>
        </div>
    );
};

export default Signout;
