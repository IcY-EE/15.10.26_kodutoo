import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateNewTask } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") ?? "all";

  try {
    let query = getSupabase()
      .from("tasks")
      .select("*")
      .order("completed", { ascending: true })
      .order("created_at", { ascending: false });

    if (status === "active") query = query.eq("completed", false);
    if (status === "completed") query = query.eq("completed", true);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/tasks", err);
    return NextResponse.json({ error: "Ülesannete laadimine ebaõnnestus" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Päringu sisu peab olema JSON" }, { status: 400 });
  }

  const result = validateNewTask(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabase()
      .from("tasks")
      .insert(result.data)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks", err);
    return NextResponse.json({ error: "Ülesande loomine ebaõnnestus" }, { status: 500 });
  }
}
