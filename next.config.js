/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async redirects() {
    return [
      {
        source: '/bookings',
        destination: '/catering#contact',
        permanent: true,
      },
      {
        source: '/meet-chef',
        destination: '/catering#chef',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
