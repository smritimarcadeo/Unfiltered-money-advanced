import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  // Pin the workspace root — a stray package-lock.json in the parent folder
  // otherwise makes Next infer the wrong root for file tracing.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
