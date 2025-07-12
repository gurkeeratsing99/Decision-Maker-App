export async function signUp(email, password) {
  try {
    const res = await fetch('http://localhost:4000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.error || 'Signup failed' };
    }

    return { data: result.data };
  } catch (err) {
    return { error: 'Network error during signup' };
  }
}

export async function createAcc(userID, email, firstName, lastName) {
  try {
    const res = await fetch('http://localhost:4000/api/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userID,
        email,
        first_name: firstName,
        last_name: lastName
      })
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.error || 'User creation failed' };
    }

    return { data: result.data };
  } catch (err) {
    return { error: 'Network error during account creation' };
  }
}
