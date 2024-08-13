/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
   images: {
      domains: ["i.ibb.co", "vl.imgix.net"],
   },
};

export default withNextIntl(nextConfig);
