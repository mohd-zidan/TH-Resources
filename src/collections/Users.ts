import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed

    {
      name: 'phone_number',
      type: 'text',
      required: true,
    },
    {
      name: 'phone_hash',
      type: 'text',
    },
  ],
}

