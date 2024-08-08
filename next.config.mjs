/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
   images: {
      domains: ["www.carlogos.org", "vl.imgix.net"],
   },
};

export default withNextIntl(nextConfig);
