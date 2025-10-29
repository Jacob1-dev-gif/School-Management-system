import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-primary-600">
          School Management System
        </h1>
        <p className="text-xl text-gray-600">
          Modern solution for managing Liberian high schools
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition"
          >
            Dashboard
          </Link>
        </div>
        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="text-left space-y-2">
            <li>✅ Student & Guardian Management</li>
            <li>✅ Attendance Tracking</li>
            <li>✅ Assessment & Grading (WASSCE-aligned)</li>
            <li>✅ Report Card Generation</li>
            <li>✅ Fee Management (LRD/USD)</li>
            <li>✅ Academic Year & Term Management</li>
            <li>✅ Role-Based Access Control</li>
            <li>✅ Notifications (Email/SMS)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
