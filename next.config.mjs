/** @type {import('next').NextConfig} */
const nextConfig = {
      ignoreDuringBuilds: true,

  images: {
    domains: ['storage.googleapis.com'],
  },
};

export default nextConfig;

