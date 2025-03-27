const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Add these lines:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
