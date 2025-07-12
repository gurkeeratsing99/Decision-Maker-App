export async function signIn(email, password) {
  const res = await fetch("http://localhost:4000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { error: result.error };
  }

  // ✅ Save token BEFORE returning
  if (result.session?.access_token) {
    localStorage.setItem("access_token", result.session.access_token);
  }

  return { user: result.user, session: result.session };
}
