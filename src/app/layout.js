import ReduxProvider from "@/store/provider"
import Navbar from "../../components/layout/Navbar"
import "./globals.css"

export const metadata = { title: "Readify", description: "Premium Blog Platform" }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <ReduxProvider>
          <Navbar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}