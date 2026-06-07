export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">PhotoVault</h1>

        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 border rounded-lg">
            Login
          </a>

          <a
            href="/signup"
            className="px-4 py-2 bg-white text-black rounded-lg"
          >
            Sign Up
          </a>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-6xl font-bold mb-6">
          Save Your Photography
        </h2>

        <p className="text-gray-400 text-xl mb-8">
          Store private drafts, publish your best work, and build your photography portfolio.
        </p>

        <a
          href="/signup"
          className="bg-white text-black px-8 py-4 rounded-xl font-semibold inline-block"
        >
          Get Started
        </a>
      </section>
    </main>
  );
}
