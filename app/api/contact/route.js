import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/writeClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await writeClient.create({
      _type: "contactMessage",
      name,
      email,
      phone: phone || "",
      message,
      receivedAt: new Date().toISOString(),
      status: "new",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
