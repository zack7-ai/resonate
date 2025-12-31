"use client";

import { usePathname } from "next/navigation";
import { Monitor } from "lucide-react";

interface MobileGuardProps {
  children: React.ReactNode;
  blockedRoutes?: string[];
}

export default function MobileGuard({
  children,
  blockedRoutes = ["/resume/builder"],
}: MobileGuardProps) {
  const pathname = usePathname();
  const isBlockedRoute = blockedRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  if (!isBlockedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Mobile Overlay - Only visible on mobile */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4 md:hidden">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <Monitor className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-foreground">
            Desktop Experience Required
          </h2>
          <p className="mb-6 text-muted-foreground">
            The Studio is optimized for Desktop. Please switch devices to edit
            your resume.
          </p>
          <p className="text-sm text-muted-foreground/80">
            You can still view your dashboard on mobile, but resume editing
            requires a larger screen for the best experience.
          </p>
        </div>
      </div>

      {/* Desktop Content - Hidden on mobile when blocked */}
      <div className="hidden md:block">{children}</div>
    </>
  );
}


