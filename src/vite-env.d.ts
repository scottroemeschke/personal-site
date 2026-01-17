/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string | undefined
  readonly VITE_SENTRY_RELEASE: string | undefined
  readonly VITE_VERCEL_ENV: string | undefined
  readonly VITE_POSTHOG_KEY: string | undefined
  readonly VITE_POSTHOG_HOST: string | undefined
  readonly VITE_POSTHOG_DEV_ENABLED: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
