import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Replace with your actual path to authOptions

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };