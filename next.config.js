module.exports = {
    allowedDevOrigins: ["https://country-communication.vercel.app", "https://countrycommu.com", "http://countrycommu.com"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },

        ],
    },
    async redirects() {
        return [
            {
                source: "/quote",
                destination: "/get-free-quote",
                permanent: true,
            },
        ];
    },
}