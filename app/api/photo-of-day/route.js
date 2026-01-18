import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  useCdn: false,
});

export async function GET(request) {
  try {
    const url = new URL(request.url);
    let today = url.searchParams.get('today');
    if (!today) {
      const d = new Date();
      today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
    }
    const queryToday = `*[_type == "photoOfDay" && date == $today][0]{_id, date, caption, credit, "image": image{asset->{_id, url, metadata}}}`;
    let doc = await client.fetch(queryToday, { today });

    if (!doc) {
      const queryLatest = `*[_type == "photoOfDay"] | order(date desc)[0]{_id, date, caption, credit, "image": image{asset->{_id, url, metadata}}}`;
      doc = await client.fetch(queryLatest);
    }

    return NextResponse.json({ success: true, data: doc || null });
  } catch (err) {
    console.error("photo-of-day API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
