// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bookme.com.bd',
        port: '',
        pathname: '/admin/**', // API & admin images allow
      },
      {
        protocol: 'https',
        hostname: 'www.bookme.com.bd',
        port: '',
        pathname: '/admin/**', // www version
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '/**', // local testing
      },
      {
        protocol: 'https',
        hostname: 'freecvbd.com',
        port: '',
        pathname: '/**', // other domain if needed
      },
    ],
  },
};

export default nextConfig;
