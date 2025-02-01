import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    webpack: (config, {dev}) => {
        if (dev) {
            config.devtool = false;
        }
        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '192.168.1.3',
                pathname: '/windrose-test/**',
            }, 
            {
                protocol: 'https',
                hostname: 's3.heggli.dev',
                pathname: '/windrose/**',
            },
        ],
    }
};

export default nextConfig;
