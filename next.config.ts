import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
});

export default withMDX(nextConfig);
