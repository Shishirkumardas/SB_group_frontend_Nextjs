import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const res = await fetch("http://localhost:8080/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include", // important for cookies
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) {
                        return null;
                    }

                    const user = await res.json();

                    // Return user object that will be saved in JWT/session
                    return {
                        id: user.id || user.email, // fallback to email if no id
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            if (token?.role) {
                session.user.role = token.role as string;
            }
            if (token?.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login?error=true",
    },

    session: {
        strategy: "jwt",
    },
});