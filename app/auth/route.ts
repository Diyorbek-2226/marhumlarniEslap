import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import axios from "axios"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Call your API endpoint for Google sign-in
          const response = await axios.post('https://api.yodimdasiz.uz/api/auth/google-sign', {
            uid: user.id,
            email: user.email,
            name: user.name,
            photo: user.image
          })
          
          if (response.data) {
            // Store the token in the token object so it's available in the session
            account.access_token = response.data.token
            return true
          }
          return false
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      // Add the access token to the session
      session.accessToken = token.accessToken
      return session
    },
    async jwt({ token, account }) {
      // Persist the access token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/login',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }