import { env } from "./src/server/env.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  console.log(env, 'env');

  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  serverActions: true,
  images: {
    domains: ['uploadthing.com', 'lh3.googleusercontent.com', "uploadthing-prod.s3.us-west-2.amazonaws.com"],
  },
});
