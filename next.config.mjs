import withNextIntl from "next-intl/plugin";
import { env } from "./app/env.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */

function defineNextConfig(config) {

  return withNextIntl('./i18n.ts')(config);
}

export default defineNextConfig({
  experimental: {
    appDir: true,
    serverActions: true
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  // supabase: {
  //   client: {
  //     auth: {
  //       persistSession: false //or true
  //     }
  //   }
  // },
  async redirects() {
    return [
      {
        source: '/train',
        destination: '/train/dashboard',
        permanent: true,
      },
      {
        source: '/build',
        destination: '/build/task',
        permanent: true,
      },

    ]
  },
  images: {
    domains: ['uploadthing.com', 'lh3.googleusercontent.com', "uploadthing-prod.s3.us-west-2.amazonaws.com"],
  },
});
