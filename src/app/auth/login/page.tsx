"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signIn('google', {
                redirect: false,
                callbackUrl: '/'
            });

            if (result?.error) {
                setError(result.error);
                return;
            }

            if (result?.url) {
                router.push(result.url);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                {error && (
                    <div className="text-red-500 text-center">
                        {error}
                    </div>
                )}
                <div>
                    <button
                        onClick={handleGoogleSignIn}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}