import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  webpack: (config) => {
    // Add rule for shader files
    config.module.rules.push({
      test: /\.(glsl|vert|frag|vs|fs)$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;
