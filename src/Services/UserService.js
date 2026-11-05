async function getUsers(signal) {
  const response = await fetch("https://dummyjson.com/users?limit=0", {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Could not load users (${response.status})`);
  }

  const data = await response.json();
  if (!Array.isArray(data.users)) {
    throw new Error("The users response was invalid");
  }

  return data.users;
}

export default getUsers;
