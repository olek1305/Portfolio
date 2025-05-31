import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
    ],
  },
};

export default withMDX(nextConfig);