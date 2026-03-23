import { Toaster } from 'react-hot-toast'
import "./globals.css";

export const metadata = {
  title: "SpendData",
  description: "Enterprise expense intelligence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: 'var(--surface-2)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff6584',
                secondary: 'var(--surface-2)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}