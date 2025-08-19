export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const upstreamUrl = new URL(
    `https://api.fitbit.com/1/${params.path.join("/")}${
      new URL(req.url).search
    }`
  )

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers: {
      Authorization: req.headers.get("authorization") ?? "",
      "Content-Type": req.headers.get("content-type") ?? "application/json",
    },
    // Avoid caching on the edge for auth-protected data
    cache: "no-store",
  })

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: {
      "content-type":
        upstreamResponse.headers.get("content-type") || "application/json",
    },
  })
}


