/** When Filip last pushed to any public GitHub repo. Cached with the page; null if GitHub is unreachable. */
export async function lastPushedAt(user: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=1`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const repos: { pushed_at?: string }[] = await res.json();
    return repos[0]?.pushed_at ?? null;
  } catch {
    return null;
  }
}
