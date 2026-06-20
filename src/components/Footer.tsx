import { PAGE_WIDTH } from "./layout";

export function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-700 py-4 md:py-6 mt-auto">
      <div className={PAGE_WIDTH}>
        <div className="flex justify-center items-center">
          <p className="text-zinc-400 text-xs sm:text-sm m-0 text-center">
            © {new Date().getFullYear()} Kindle Notes Frontend. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
