'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">👨‍🎓</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">📋</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Attendance Today</dt>
                    <dd className="text-lg font-medium text-gray-900">0%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">💰</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Fees Collected</dt>
                    <dd className="text-lg font-medium text-gray-900">LRD 0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">📄</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Invoices</dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/students" className="p-4 border rounded hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">👨‍🎓</div>
              <div className="text-sm font-medium">Students</div>
            </Link>
            <Link href="/attendance" className="p-4 border rounded hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium">Attendance</div>
            </Link>
            <Link href="/assessment" className="p-4 border rounded hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium">Assessment</div>
            </Link>
            <Link href="/finance" className="p-4 border rounded hover:bg-gray-50 text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-medium">Finance</div>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>School:</strong> Demo High School</p>
            <p><strong>Academic Year:</strong> 2024/2025</p>
            <p><strong>Current Term:</strong> First Term</p>
            <p><strong>Timezone:</strong> Africa/Monrovia</p>
            <p><strong>Currency:</strong> LRD</p>
          </div>
        </div>
      </main>
    </div>
  );
}
