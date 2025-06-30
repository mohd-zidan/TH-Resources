import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import React from 'react'

import { getPayloadClient } from '@/payloadClient'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayloadClient()

  const { user } = await payload.auth({ headers })

  const adminUrl = payload.getAdminURL()

  return (
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && <h1>Welcome to TinkerHub Resources</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}
        <div className="links">
          <a className="admin" href={adminUrl} rel="noopener noreferrer" target="_blank">
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
