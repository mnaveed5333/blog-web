export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}