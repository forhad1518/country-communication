module.exports = {
    allowedDevOrigins: ['172.30.130.146',"10.21.173.146", "https://country-communication.vercel.app", "10.204.87.146", "https://countrycommu.com", "http://countrycommu.com"],
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