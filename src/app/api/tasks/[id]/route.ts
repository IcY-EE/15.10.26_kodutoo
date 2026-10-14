import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { isUuid, validateTaskUpdate } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Vigane ID" }, { status: 400 });

  const { data, error } = await getSupabase()
    .from("tasks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("GET /api/tasks/[id]", error);
    return NextResponse.json({ error: "Laadimine ebaõnnestus" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Ülesannet ei leitud" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Vigane ID" }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Päringu sisu peab olema JSON" }, { status: 400 });
  }

  const result = validateTaskUpdate(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const { data, error } = await getSupabase()
    .from("tasks")
    .update(result.data)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("PATCH /api/tasks/[id]", error);
    return NextResponse.json({ error: "Muutmine ebaõnnestus" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Ülesannet ei leitud" }, { status: 404 });

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Vigane ID" }, { status: 400 });

  const { data, error } = await getSupabase()
    .from("tasks")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("DELETE /api/tasks/[id]", error);
    return NextResponse.json({ error: "Kustutamine ebaõnnestus" }, { status: 500 });
  }
  if (!data || data.length === 0)
    return NextResponse.json({ error: "Ülesannet ei leitud" }, { status: 404 });

  return new NextResponse(null, { status: 204 });
}
