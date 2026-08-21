export async function onRequestGet(context) {
  const key = context.env.SERVER_KEY;
  if (!key) {
    return Response.json({ error: true, message: "SERVER_KEY is not configured" }, { status: 500 });
  }

  try {
    const upstream = await fetch("https://api.policeroleplay.community/v1/server", {
      headers: { "Server-Key": key, "Accept": "application/json" },
      cf: { cacheTtl: 15, cacheEverything: false }
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return Response.json({ error: true, message: data?.message || "PRC API request failed", code: data?.code ?? upstream.status }, { status: upstream.status });
    }

    return Response.json({
      error: false,
      name: data?.Name || "OG Romania",
      currentPlayers: Number(data?.CurrentPlayers ?? 0),
      maxPlayers: Number(data?.MaxPlayers ?? 0),
      joinKey: data?.JoinKey || null
    }, {
      headers: {
        "Cache-Control": "public, max-age=15, s-maxage=15"
      }
    });
  } catch (err) {
    return Response.json({ error: true, message: "Nu s-a putut verifica serverul." }, { status: 502 });
  }
}
