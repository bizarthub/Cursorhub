// Función serverless (Vercel): consulta Supabase desde el servidor.
// Las keys se leen de variables de entorno y nunca llegan al navegador.
module.exports = async (req, res) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  res.setHeader("Content-Type", "application/json");

  if (!url || !key) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: "Supabase no está configurado" }));
  }

  try {
    const r = await fetch(`${url}/rest/v1/productos?select=*&order=id`, {
      headers: { apikey: key },
    });
    const data = await r.json();
    res.statusCode = r.ok ? 200 : r.status;
    res.end(JSON.stringify(r.ok ? data : { error: data.message || "Error de Supabase" }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
};
