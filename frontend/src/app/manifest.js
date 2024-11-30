export default function manifest() {
    return {
      name: 'KampusPay',
      short_name: 'K-Pay',
      description: 'Digital Campus Payment and Budgeting Application',
      start_url: '/',
      display: 'standalone',
      background_color: '#7F3DFF',
      theme_color: '#7F3DFF',
      icons: [
        {
          src: '/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
        },
      ],
    }
  }