// next/image (unoptimized) and raw loaders don't apply Next's basePath to
// string srcs, so every static asset path goes through this helper to work
// on the GitHub Pages subpath as well as at the domain root.
export const withBase = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
