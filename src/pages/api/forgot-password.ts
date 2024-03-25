// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
// Importamos la conexión a la base de datos que hemos creado en el archivo items.ts
import { connection as db } from "@/pages/api/items";
// Importamos el tipo APIContext de Astro que nos permite manejar las solicitudes a la API
import type { APIContext } from "astro";
// Importamos resend
import { Resend } from "resend";
// Importamos dotenv para poder acceder a las variables de entorno
import "dotenv/config";
// Importamos RowDataPacket de mysql2/promise
import { type RowDataPacket } from "mysql2/promise";
// Creamos una instancia de resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE user_email = ?",
    [email],
  );

  const id = rows[0]?.id;

  if (rows.length === 0) {
    return context.redirect(
      "/forgot-password?error=email_not_exists&toast=Error+al+enviar+el+correo+de+restablecimiento",
    );
  }

  await resend.emails.send({
    from: "Polkadev <alvarobarcena@polkadev.es>",
    to: ["alvarobarcena27@gmail.com"],
    subject: "Hello World",
    html:
      `<strong>It works! ${email}</strong><a href="http://localhost:4321/reset-password/${id}">Reset your password</a>`,
  });

  return context.redirect(
    `/email-sent/${id}?email=sent`,
  );
}
