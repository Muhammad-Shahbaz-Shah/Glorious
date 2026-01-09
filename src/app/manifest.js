// app/manifest.js
export default function manifest() {
  return {
    name: 'Glorious Ecommerce',
    short_name: 'Glorious',
    description: "Shop the latest trends at Glorious. We bring you a seamless, fast, and secure shopping experience with handpicked items that define modern living. Upgrade your lifestyle today.",
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f5f0', // Your nature-theme background
    theme_color: '#2e7d32',      // Your nature-theme primary green
    icons: [
      {
        src: '/icon.png',
        type: 'image/png',
      },
     
    ],
  }
}