import { LayoutDashboard, Inbox, Calendar, BarChart3, Settings, Bot, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface AppSidebarProps {
  onToggleChat: () => void;
  chatOpen: boolean;
}

export function AppSidebar({ onToggleChat, chatOpen }: AppSidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Board", active: true, action: () => {} },
    { icon: Inbox, label: "Inbox", active: false, action: () => toast("Inbox — em breve!") },
    { icon: Calendar, label: "Calendário", active: false, action: () => toast("Calendário — em breve!") },
    { icon: BarChart3, label: "Relatórios", active: false, action: () => toast("Relatórios — em breve!") },
    { icon: Settings, label: "Configurações", active: false, action: () => toast("Configurações — em breve!") },
  ];

  return (
    <aside className="flex h-screen w-16 flex-col items-center border-r border-sidebar-border bg-sidebar py-6 gap-2">
      {/* Logo */}
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-foreground to-muted-foreground shadow-lg">
        <span className="font-display text-lg font-bold text-background">K</span>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            title={item.label}
            onClick={item.action}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </nav>

      {/* AI Chat button */}
      <button
        onClick={onToggleChat}
        title="Assistente IA"
        className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
          chatOpen
            ? "bg-foreground text-background shadow-lg"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        }`}
      >
        <Bot className="h-5 w-5" />
        {!chatOpen && (
          <Sparkles className="absolute -top-0.5 -right-0.5 h-3 w-3 text-foreground animate-pulse" />
        )}
      </button>
    </aside>
  );
}
