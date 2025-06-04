// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Resources } from './collections/Resources'
// Commenting out Memberships and Events as they are being removed
// import { Memberships } from './collections/Memberships'
// import { Events } from './collections/Events'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    // Commenting out importMap as it might not be needed and could cause issues
    // if its dependencies or purpose aren't aligned with the current project structure.
    // importMap: {
    //   baseDir: path.resolve(dirname),
    // },
  },
  collections: [
    Users,
    Media,
    Resources,
    // Memberships,
    // Events
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
