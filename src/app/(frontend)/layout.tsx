import React from 'react'
import './styles.css'

export const metadata = {
  description: 'A CMS app for managing TinkerHub resources.',
  title: 'TinkerHub Resources',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
