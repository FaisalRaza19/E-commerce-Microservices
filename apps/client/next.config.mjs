const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  productionBrowserSourceMaps: true,
  reactCompiler: true,
  output: "standalone",
  transpilePackages: ["@repo/eslint-config", "@repo/typescript-config"],
};

export default nextConfig;