import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const tools = [
  {
    type: "function",
    function: {
      name: "list_tasks",
      description: "Lista todas as tarefas do quadro Kanban, opcionalmente filtradas por status ou prioridade.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["backlog", "todo", "in_progress", "review", "done"], description: "Filtrar por status" },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"], description: "Filtrar por prioridade" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Cria uma nova tarefa no quadro Kanban.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Título da tarefa (obrigatório)" },
          description: { type: "string", description: "Descrição da tarefa" },
          status: { type: "string", enum: ["backlog", "todo", "in_progress", "review", "done"], description: "Status inicial" },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"], description: "Prioridade" },
          tags: { type: "array", items: { type: "string" }, description: "Tags da tarefa" },
          due_date: { type: "string", description: "Data de vencimento (YYYY-MM-DD)" },
          progress: { type: "number", description: "Progresso (0-100)" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_task",
      description: "Atualiza uma tarefa existente. Use list_tasks primeiro para obter o ID.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", description: "UUID da tarefa" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["backlog", "todo", "in_progress", "review", "done"] },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
          tags: { type: "array", items: { type: "string" } },
          due_date: { type: "string" },
          progress: { type: "number" },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_task",
      description: "Exclui uma tarefa pelo ID. Use list_tasks primeiro para obter o ID.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", description: "UUID da tarefa" },
        },
        required: ["id"],
      },
    },
  },
];

async function executeTool(name: string, args: Record<string, any>): Promise<string> {
  try {
    if (name === "list_tasks") {
      let query = supabase.from("tasks").select("*").order("order", { ascending: true });
      if (args.status) query = query.eq("status", args.status);
      if (args.priority) query = query.eq("priority", args.priority);
      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify(data);
    }

    if (name === "create_task") {
      const { title, description, status, priority, tags, due_date, progress } = args;
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title,
          description: description || null,
          status: status || "todo",
          priority: priority || "medium",
          tags: tags || [],
          due_date: due_date || null,
          progress: progress ?? 0,
          order: Math.floor(Date.now() / 1000) % 2147483647,
        })
        .select()
        .single();
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ success: true, task: data });
    }

    if (name === "update_task") {
      const { id, ...updates } = args;
      const cleanUpdates: Record<string, any> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (v !== undefined) cleanUpdates[k] = v;
      }
      const { data, error } = await supabase
        .from("tasks")
        .update(cleanUpdates)
        .eq("id", id)
        .select()
        .single();
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ success: true, task: data });
    }

    if (name === "delete_task") {
      const { error } = await supabase.from("tasks").delete().eq("id", args.id);
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ success: true });
    }

    return JSON.stringify({ error: "Unknown tool" });
  } catch (e) {
    return JSON.stringify({ error: e instanceof Error ? e.message : "Tool execution failed" });
  }
}

const systemPrompt = `Você é um assistente inteligente para um quadro Kanban. Responda sempre em português brasileiro.

Você tem acesso a ferramentas para interagir diretamente com as tarefas do quadro:
- list_tasks: listar/consultar tarefas (use para ver o estado do board antes de modificar)
- create_task: criar novas tarefas
- update_task: EDITAR tarefas existentes (mudar título, descrição, status, prioridade, tags, progresso, data de vencimento)
- delete_task: excluir tarefas

REGRAS IMPORTANTES:
- Sempre use list_tasks primeiro para consultar o board antes de fazer modificações
- Quando o usuário pedir para EDITAR uma tarefa existente (mudar título, descrição, prioridade, etc.), use list_tasks para encontrar o ID e depois update_task
- Quando o usuário pedir para mover uma tarefa, use update_task com o novo status
- Quando criar tarefas, confirme o que foi criado
- Quando excluir, confirme a exclusão
- Seja conciso, útil e amigável. Use emojis com moderação.
- Ao listar tarefas, formate-as de forma legível com título, status e prioridade.
- Você pode modificar QUALQUER campo de uma tarefa existente: title, description, status, priority, tags, due_date, progress

Status disponíveis: backlog, todo (A Fazer), in_progress (Em Andamento), review (Revisão), done (Completo)
Prioridades: low (Baixa), medium (Média), high (Alta), urgent (Urgente)`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const apiMessages = [{ role: "system", content: systemPrompt }, ...messages];
    let mutatedTasks = false;

    // Loop for tool calling
    const MAX_ITERATIONS = 5;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: apiMessages,
          tools,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error("AI gateway error:", response.status, t);
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const msg = choice?.message;

      if (!msg) throw new Error("No message in response");

      // If there are tool calls, execute them
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        apiMessages.push(msg);

        for (const toolCall of msg.tool_calls) {
          const fnName = toolCall.function.name;
          const fnArgs = JSON.parse(toolCall.function.arguments || "{}");
          console.log(`Tool call: ${fnName}`, fnArgs);

          const result = await executeTool(fnName, fnArgs);

          if (fnName !== "list_tasks") mutatedTasks = true;

          apiMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: result,
          });
        }
        // Continue loop to get final response
        continue;
      }

      // No tool calls — return final response
      const content = msg.content || "Não consegui gerar uma resposta.";
      return new Response(JSON.stringify({ content, mutatedTasks }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ content: "Desculpe, a operação ficou muito complexa. Tente simplificar seu pedido.", mutatedTasks }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
