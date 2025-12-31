import React from "react";
import { FileSearch, Ghost, Briefcase, FileText, Target } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: "ghost" | "file" | "jobs" | "resume" | "search";
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "ghost",
}: EmptyStateProps) {
  const getIcon = () => {
    const iconClass = "h-16 w-16 text-muted-foreground/30";
    switch (icon) {
      case "ghost":
        return <Ghost className={iconClass} />;
      case "file":
        return <FileSearch className={iconClass} />;
      case "jobs":
        return <Target className={iconClass} />;
      case "resume":
        return <FileText className={iconClass} />;
      case "search":
        return <FileSearch className={iconClass} />;
      default:
        return <Ghost className={iconClass} />;
    }
  };

  const getDefaultTitle = () => {
    if (title) return title;
    switch (icon) {
      case "jobs":
        return "No opportunities found";
      case "resume":
        return "No resume data";
      default:
        return "Nothing here yet";
    }
  };

  const getDefaultDescription = () => {
    if (description) return description;
    switch (icon) {
      case "jobs":
        return "Start scouting by saving your first opportunity or job posting.";
      case "resume":
        return "Upload your resume or start building one to get started.";
      default:
        return "Get started by adding your first item.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">{getIcon()}</div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {getDefaultTitle()}
      </h3>
      <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
        {getDefaultDescription()}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
