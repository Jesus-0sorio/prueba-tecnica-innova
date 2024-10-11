import { authService } from "@/services/auth.service";
import jwt from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  access_token: string;
  email: string;
  id: string;
  role: string;
}

const authOptions: NextAuthOptions = {
  secret: "secreto",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "your@email.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••",
        },
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.username || !credentials?.password) return null;

        const { username, password } = credentials;

        try {
          const res = await authService.login(username, password);

          if (!res) {
            return res;
          }
          const { access_token } = res.data;
          // Decode the token from the response
          const jwtDecode = jwt.decode(access_token);
          const { email, id, role } = jwtDecode as {
            email: string;
            id: string;
            role: string;
          };
          const user: User = {
            access_token,
            email,
            id,
            role,
          };
          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          email: token?.email,
          id: token?.sub,
          role: token?.role,
          token: token.access_token,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// export {GET, POST} from '@/auth'
