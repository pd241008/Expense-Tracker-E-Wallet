export async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, { ...opts });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}
