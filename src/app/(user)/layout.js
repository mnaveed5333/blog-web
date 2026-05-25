export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}