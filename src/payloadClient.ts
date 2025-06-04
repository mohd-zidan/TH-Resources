import dotenv from 'dotenv'
import path from 'path'
import type { InitOptions } from 'payload/config'
import payload, { Payload } from 'payload'
import nodemailer from 'nodemailer'

// Import the default export from your payload.config.ts
import configPromise from '@/payload.config' // Path alias from tsconfig.json

// Load .env file from the root of the project
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Define a nodemailer transport if you are using email features
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  secure: true,
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

interface Args {
  initOptions?: Partial<InitOptions>
}

export const getPayloadClient = async (args?: Args): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing')
  }

  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    const awaitedConfig = await configPromise // Resolve the config promise
    cached.promise = payload
      .init({
        secret: process.env.PAYLOAD_SECRET,
        local: true, // Key for using local API; this will load your payload.config.ts by path
        config: awaitedConfig, // Explicitly pass the resolved config
        ...(process.env.SMTP_HOST &&
          process.env.SMTP_USER &&
          process.env.SMTP_PASS && {
            email: {
              transport: transporter,
              fromAddress: process.env.SMTP_FROM_ADDRESS || 'hello@example.com',
              fromName: process.env.SMTP_FROM_NAME || 'Payload CMS',
            },
          }),
        ...(args?.initOptions || {}),
      })
      .then((client: Payload) => {
        // Make sure to delete the local config cache if you are locally developing
        // and making changes to your config in real-time.
        // Otherwise, you will not see your changes reflected without a server restart.
        // This is not strictly necessary for production, but good for dev.
        if (process.env.NODE_ENV === 'development') {
          // @ts-expect-error // This is a private API but useful for dev
          delete payload.localConfigCache
        }
        cached.client = client
        return client
      })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}
