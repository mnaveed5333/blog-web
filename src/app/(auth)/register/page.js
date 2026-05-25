import RegisterForm from "@/components/auth/RegisterForm"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-500 mt-2">Start reading premium content today</p>
        </div>
        <RegisterForm />
        <p className="text-center text-slate-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline font-medium">Login here</Link>
        </p>
      </div>
    </div>
  )
}