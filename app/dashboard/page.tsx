export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          PhotoVault Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold">
              My Profile
            </h2>
            <p className="text-gray-400 mt-2">
              Manage profile picture and bio
            </p>
          </div>

          <div className="border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold">
              Draft Photos
            </h2>
            <p className="text-gray-400 mt-2">
              Save photography drafts
            </p>
          </div>

          <div className="border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold">
              Published Photos
            </h2>
            <p className="text-gray-400 mt-2">
              Public portfolio gallery
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
