import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MetroHCM | Hành trình tương lai',
    short_name: 'MetroHCM',
    description: 'Hệ thống đặt vé tàu điện ngầm hiện đại nhất TP. Hồ Chí Minh.',
    start_url: '/',
    display: 'standalone',
    background_color: '#06080F',
    theme_color: '#007AFF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida/ADBb0uhQklnHzTuP5Puo021Zw7yIYFgjrxwiIraPTRsqxDETLS2FQGjeCIUBYCQw4uEgEC5WSo8fhagxEDnXmJv8-Hx0mN8fPnoWgq5KcKpMBjZalyIEGTV9PrGzi02hyH5GNfp5w-pAIlP95N4HdAZTTwqPxZIqpepIyjO4VBaXm1iZQFepsa8b0AjsNURGjgHaKNeGHUFHBTdCouJkJulq-ptz3PLUnGKZKhbfYOtRzV7fPLDB9UOybMfXnHC5',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  };
}
