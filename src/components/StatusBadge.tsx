import { Badge } from "@/components/ui/badge";
import { IssueStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

const statusConfig = {
  NEW: { label: "New", className: "bg-muted text-muted-foreground" },
  ACKNOWLEDGED: { label: "Acknowledged", className: "bg-info text-info-foreground" },
  IN_PROGRESS: { label: "In Progress", className: "bg-warning text-warning-foreground" },
  RESOLVED: { label: "Resolved", className: "bg-success text-success-foreground" },
  REJECTED: { label: "Rejected", className: "bg-destructive text-destructive-foreground" },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};
