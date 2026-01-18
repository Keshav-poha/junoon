"use client";
import { useEffect, useState } from "react";
import RenderImage from "./RenderImage";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";

export default function PhotoOfDay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const d = new Date();
    const clientToday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;

    fetch(`/api/photo-of-day?today=${clientToday}`)
      .then((r) => r.json())
      .then((res) => {
        if (!mounted) return;
        if (res.success && res.data) setData(res.data);
        else if (!res.success) setError(res.error || 'No photo available');
      })
      .catch((err) => {
        if (!mounted) return;
        setError('Failed to load');
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Card className="p-4">
          <div>Loading Photo of the Day...</div>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Card className="p-4">{error || 'No Photo of the Day yet.'}</Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Card className="md:flex md:items-center md:gap-6">
        <div className="md:w-1/3">
          <div className="overflow-hidden rounded-lg">
            {data.image?.asset?.url ? (
              <RenderImage image={{ asset: data.image.asset }} sizes="(max-width: 768px) 100vw, 33vw" />
            ) : (
              <div className="h-40 bg-gray-900" />
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:w-2/3">
          <CardHeader>
            <CardTitle>Photo of the Day</CardTitle>
            <Badge>{data.date}</Badge>
          </CardHeader>
          {data.caption && (
            <CardContent>
              <p className="mb-2">{data.caption}</p>
            </CardContent>
          )}
          {data.credit && (
            <div className="text-sm text-muted-foreground">Credit: {data.credit}</div>
          )}
        </div>
      </Card>
    </div>
  );
}
