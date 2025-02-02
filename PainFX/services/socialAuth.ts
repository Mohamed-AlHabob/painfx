export default async function continueWithSocialAuth(
  provider: string,
  redirect: string
) {
  try {
    const backendUrl =
      process.env.EXPO_PUBLIC_BACKEND_API_URL || "https://painfx.onrender.com";
    const redirectUri =
      process.env.EXPO_PUBLIC_REDIRECT_URL || "http://localhost:3000";

    if (!backendUrl || !redirectUri) {
      throw new Error("Missing necessary environment variables");
    }

    const url = `${backendUrl}/api/o/${provider}/?redirect_uri=${redirectUri}/${redirect}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      return data.authorization_url;
    } else {
      const errorMessage = data?.detail || "Something went wrong";
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error("Error during social auth:", err);
    throw err;
  }
}
