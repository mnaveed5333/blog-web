import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Login to your account</p>
        </div>
        <LoginForm />
        <p className="text-center text-slate-500 mt-6 text-sm">
          No account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline font-medium">Register here</Link>
        </p>
      </div>
    </div>
  )
}