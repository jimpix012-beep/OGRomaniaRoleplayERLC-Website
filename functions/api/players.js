
export async function onRequestGet(context) {
  const key = context.env.SERVER_KEY;
  if (!key) {
    return Response.json(
      { error: "SERVER_KEY is not configured", players: [], currentPlayers: 0, maxPlayers: 0 },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const upstream = await fetch("https://api.policeroleplay.community/v1/server", {
      headers: { "Server-Key": key }
    });

    if (!upstream.ok) {
      return Response.json(
        { error: "ER:LC API unavailable", players: [], currentPlayers: 0, maxPlayers: 0 },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const server = await upstream.json();

    const playersRes = await fetch("https://api.policeroleplay.community/v1/server/players", {
      headers: { "Server-Key": key }
    });

    let players = [];
    if (playersRes.ok) {
      const raw = await playersRes.json();
      players = Array.isArray(raw) ? raw : [];
    }

    return Response.json(
      {
        currentPlayers: Number(server.CurrentPlayers ?? players.length ?? 0),
        maxPlayers: Number(server.MaxPlayers ?? 0),
        players: players.map(p => ({
          name: p?.Player ?? p?.Name ?? p?.Username ?? p?.username ?? String(p)
        }))
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch {
    return Response.json(
      { error: "Unexpected error", players: [], currentPlayers: 0, maxPlayers: 0 },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
