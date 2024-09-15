// import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '../components/Footer'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '券商買賣超分點查詢系統',
  description: '查詢股票券商買賣超分點資訊',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
