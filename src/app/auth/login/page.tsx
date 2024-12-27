"use client"
import {useState} from 'react';
import {signIn} from 'next-auth/react';
import {useRouter, useSearchParams} from 'next/navigation';
import Image from "next/image";
import {IconBrandGithub} from "@tabler/icons-react";

export default function LoginPage() {
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(searchParams.get('error'));
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

    }

    const handleGithubSignIn = async () => {
        try {
            const result = await signIn('github', {
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
    }

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-full">
            <div className="max-w-md w-full space-y-8 border-2 border-neutral rounded-lg bg-base-200 p-4 m-auto">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold">
                        Sign in to Windrose
                    </h2>
                </div>
                {error && (
                    <div className="text-red-500 text-center">
                        {error}
                    </div>
                )}
                <div className={'flex flex-col gap-2'}>
                    <button
                        onClick={handleGoogleSignIn}
                        className="group relative w-full h-12 flex py-1 justify-center items-center text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-black border border-gray-50 shadow-lg"
                    >
                        <Image src={'/google.webp'} alt={"google"} width={32} height={32}/>
                        Continue with Google
                    </button>
                    <button
                        onClick={handleGithubSignIn}
                        className="group relative w-full flex h-12 py-1 justify-center items-center text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-black text-white border border-gray-950 shadow-lg"
                    >
                        <IconBrandGithub size={24} className={'mr-1'}/>
                        Continue with Github
                    </button>
                </div>
            </div>
        </div>
    );
}