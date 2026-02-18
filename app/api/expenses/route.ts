import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "date";
  const order = searchParams.get("order") || "desc";

  let query = supabase
    .from("expenses")
    .select("*")
    .order(sort, { ascending: order === "asc" });

  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("expenses")
    .insert([body])
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
