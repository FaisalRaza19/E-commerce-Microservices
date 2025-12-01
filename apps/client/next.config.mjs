import path from "path";

const nextConfig = {
  reactCompiler: true,
  output: "standalone",

  transpilePackages: ["@repo/eslint-config", "@repo/typescript-config"],

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd(), "src"),
    };

    return config;
  },
};

export default nextConfig;
