const nextConfig = {
  reactCompiler: true,
  output: "standalone",
  transpilePackages: ["@repo/eslint-config", "@repo/typescript-config"],
};

export default nextConfig;