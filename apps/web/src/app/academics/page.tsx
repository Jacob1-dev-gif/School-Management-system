'use client';

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Academics Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">
            Academic management features will be available here.
          </p>
          <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600">
            <li>Manage academic years and terms</li>
            <li>Create and manage classes</li>
            <li>Add and assign subjects</li>
            <li>Record daily attendance</li>
            <li>Enter assessments and grades</li>
            <li>View WASSCE grade scales</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
