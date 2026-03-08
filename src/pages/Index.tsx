import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AIChatPanel } from "@/components/AIChatPanel";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar onToggleChat={() => setChatOpen(!chatOpen)} chatOpen={chatOpen} />
      <KanbanBoard />
      <AIChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Index;
