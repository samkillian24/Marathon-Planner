// netlify/functions/strava-auth.js
// Exchanges a Strava authorization code for an access token.
// STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET must be set in
// Netlify → Site configuration → Environment variables.

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://marathontrainingsam.netlify.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let code;
  try {
    ({ code } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  if (!code) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing code" }) };
  }

  const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = process.env;
  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server not configured — add env vars in Netlify" }) };
  }

  try {
    const resp = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      heade
