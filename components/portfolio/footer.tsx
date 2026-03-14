"use client"

export function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dev. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            {/* add policy links */}
          </p>
        </div>
      </div>
    </footer>
  )
}
