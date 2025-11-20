import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, BarChart3, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const menuItems = [
  { icon: LayoutDashboard, label: "dashboard", path: "/dashboard" },
  { icon: FileText, label: "issues", path: "/issues" },
  { icon: BarChart3, label: "analytics", path: "/analytics" },
];

export const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
        <Building2 className="h-6 w-6 text-sidebar-primary" />
        <span className="font-semibold text-sidebar-foreground">Jharkhand Civic CRM</span>
      </div>
      
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{t(item.label)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
