/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "ltumdudsonhfqekxkzbl.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/images/**",
      },
    ],
  },
};

export default nextConfig;
