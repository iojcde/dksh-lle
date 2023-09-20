/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      const config2 = Object.assign(config, {
        externals: {
          dockerode: "dockerode",
          ssh2: "ssh2",
        },
      });
      return config2;
    } else {
      return config;
    }
  },
};

module.exports = nextConfig;
