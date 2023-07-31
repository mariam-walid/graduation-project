import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) {
          return null;
        }
        const res = await fetch("http://localhost:8000/auth/jwt/login", {
          method: "POST",
          body: `username=${credentials.email}&password=${credentials.password}`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        const user = await res.json()
        if (res.ok) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return {...token, ...user};
    },

    async session({ session, token, user }) {
      session.user = token;
      session.accessToken = token.accessToken ;
      return session;
    },
  },
  session:{
    strategy:'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
