import { LayoutDashboard, Inbox, Calendar, BarChart3, Settings, Bot } from "lucide-react";

interface AppSidebarProps {
  onToggleChat: () => void;
  chatOpen: boolean;
}

export function AppSidebar({ onToggleChat, chatOpen }: AppSidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Board", active: true },
    { icon: Inbox, label: "Inbox", active: false },
    { icon: Calendar, label: "Calendário", active: false },
    { icon: BarChart3, label: "Relatórios", active: false },
    { icon: Settings, label: "Configurações", active: false },
  ];

  return (
    <aside className="flex h-screen w-16 flex-col items-center border-r border-border bg-card py-6 gap-2">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
        <span className="font-display text-lg font-bold text-primary-foreground">K</span>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            title={item.label}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              item.active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </nav>

      <button
        onClick={onToggleChat}
        title="Assistente IA"
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
          chatOpen
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        }`}
      >
        <Bot className="h-5 w-5" />
      </button>
    </aside>
  );
}
