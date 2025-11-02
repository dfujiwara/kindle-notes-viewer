export function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-700 py-4 md:py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-xs sm:text-sm m-0 text-center sm:text-left">
            © {new Date().getFullYear()} Kindle Notes Frontend. All rights
            reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a
              href="/about"
              className="text-zinc-400 no-underline text-xs sm:text-sm transition-colors hover:text-white"
            >
              About
            </a>
            <a
              href="/privacy"
              className="text-zinc-400 no-underline text-xs sm:text-sm transition-colors hover:text-white"
            >
              Privacy
            </a>
            <a
              href="/contact"
              className="text-zinc-400 no-underline text-xs sm:text-sm transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
