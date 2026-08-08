import type { NextConfig } from "next";

// GITHUB_PAGES=true builds a static export served under the repo subpath
// (see .github/workflows/deploy-pages.yml). Local dev/build is unaffected.
const ghPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = ghPages
  ? {
      output: "export",
      basePath,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
