module.exports = {
    allowedDevOrigins: ['172.25.202.146',"192.168.0.102", "https://country-communication.vercel.app", "10.190.19.146"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}