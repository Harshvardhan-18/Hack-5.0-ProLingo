import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source : '/api/(.*)',
        headers: [
          {
            key : "ACCESS-CONTROL-Allow-Origin",
            value : '*',
          },
          {
            key : "ACCESS-CONTROL-Allow-Methods",
            value : 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key : "ACCESS-CONTROL-Allow-Headers",
            value : 'Content-Type, Authorization',
          },
          {
            key : "Content-Range",  
            value : 'bytes : 0-9/*',
          },
        ]
      }
    ]
  }
};

export default nextConfig;
