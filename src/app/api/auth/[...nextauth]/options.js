import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/Users";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("Credentials:", credentials);
console.log("Found user:", User);
console.log("User status:", User?.status);
console.log("User role:", User?.role?.name);

       await dbConnect();

        try {
          const { email, password } = credentials;

          const user = await User.findOne({email}).populate("role")
          if(!user){
            throw new Error("No user found with this email")
          }
          if(user.status !== "active"){
            throw new Error("You are not active hence you can't use this app")
          }

          if(password != user.password){
            throw new Error("Incorrect password")
          }

          console.log({id:user._id.toString(),
            email:user.email, role:user.role.name, roleID:user.role})
          return {
            id:user._id.toString(),
            email:user.email,
            role:user.role.name
          }



    

        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
