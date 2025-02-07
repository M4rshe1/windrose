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
                protocol: 'http',
                hostname: 's3.heggli.dev',
                pathname: '/windrose-test/**',
                port: "443",
            }, 
            {
                protocol: 'http',
                hostname: 's3.heggli.dev',
                pathname: '/windrose/**',
                port: "443",
            },
        ],
    }
};

export default nextConfig;
