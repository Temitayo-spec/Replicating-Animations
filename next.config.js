/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure each showcased component's source file is bundled in production so
  // the "View source" panel can read and display it.
  outputFileTracingIncludes: {
    '/**': ['./src/app/**/*.tsx'],
  },
}

module.exports = nextConfig
