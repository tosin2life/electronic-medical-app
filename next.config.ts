// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "images.pexels.com",
//         port: "",
//         pathname: "/photos/**",
//       },
//     ],
//   },
// };

// export default nextConfig;
// import MiniCssExtractPlugin from "mini-css-extract-plugin";

// module.exports = {
//   plugins: [new MiniCssExtractPlugin()],
//   module: {
//     rules: [
//       {
//         test: /\.css$/i,
//         use: [MiniCssExtractPlugin.loader, "css-loader"],
//       },
//     ],
//   },
// };
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },
    ],
  },
};

export default nextConfig;
