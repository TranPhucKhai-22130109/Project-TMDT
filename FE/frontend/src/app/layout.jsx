import '@/styles/globals.css';
import { CartProvider } from '@/app/cart/CartContext';
export const metadata = {
  title: 'Blitz Flash Sale - Free Tailwind Template',
  description: 'Download this free Tailwind CSS Ecommerce website template for Blitz Flash Sale. Features a bold design, fully responsive layout, and includes 10 pre-built pages like index.html, deals.html, contact.html.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <CartProvider>
      <body>{children}</body>
      </CartProvider>
    </html>
  );
}
