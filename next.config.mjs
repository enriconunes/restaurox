/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                // port: '',
                // pathname: '/account123/**',
            },
        ],
    },
    // Adicione estas configurações para melhorar o desempenho
    reactStrictMode: true,
    swcMinify: true,
};

export default nextConfig;
