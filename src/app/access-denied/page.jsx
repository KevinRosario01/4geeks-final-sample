// pages/access-denied.js
export default function AccessDenied() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-700 mb-6">
              You do not have permission to view this page.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-300"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }
  