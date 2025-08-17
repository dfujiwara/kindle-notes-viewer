export function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-700 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-zinc-400 text-sm m-0">
            © {new Date().getFullYear()} Kindle Notes Frontend. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="/about"
              className="text-zinc-400 no-underline text-sm transition-colors hover:text-white"
            >
              About
            </a>
            <a
              href="/privacy"
              className="text-zinc-400 no-underline text-sm transition-colors hover:text-white"
            >
              Privacy
            </a>
            <a
              href="/contact"
              className="text-zinc-400 no-underline text-sm transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
