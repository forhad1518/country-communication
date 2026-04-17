module.exports = {
    allowedDevOrigins: ['172.25.202.146',"192.168.0.103", "https://country-communication.vercel.app", "10.20.132.146"],
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
}