import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ||'',
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',  // A custom sign-in page
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // Only allow signing in if the user's email ends with '@elivaas.com'
            const allowedEmails = ['aayush.garg@elivaas.com',
                'vinod@elivaas.com',
                'reewa.gautam@elivaas.com',
                'chaitanya.jain@elivaas.com',
                'priyanshu.sharma@elivaas.com',
                'km@elivaas.com',
                'vanshika.sanan@elivaas.com',
                'frazmdsaif@elivaas.com',
            ];
            if (user.email && allowedEmails.includes(user.email)) {
                return true;
            }
            // Optionally, add custom error handling or logging here
            return false;  // Reject all other users
        },
        async jwt({ token, account }) {
            console.log('aaaa')
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            console.log('bbbb',session)
            console.log('bbbb111')
            // if(session?.user?.name) {
            //     session?.user?.role='admin'
            // }
            console.log(session)
            return session;
        },
        async redirect({ url, baseUrl }) {
            console.log('redirect')
            // Only redirect to the intended URL if it's from your site
            if (url.startsWith(baseUrl)) {
                return url;
            }
            // Default to the home page if the URL is external
            return baseUrl;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
});
