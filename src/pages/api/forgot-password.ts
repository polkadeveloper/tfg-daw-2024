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
// Importamos el Email template que hemos creado en React
import { EmblemForgotPassword } from "@/components/React/emails/ForgotPasswordTemplate";
// Creamos una instancia de resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");

  // Comprobamos si el email existe en la base de datos
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE user_email = ?",
    [email],
  );

  // Obtenemos el id del usuario
  const id = rows[0]?.id;

  // Si el email no existe en la base de datos, devolvemos un error
  if (rows.length === 0) {
    return new Response(
      JSON.stringify({
        error: "email_not_found",
        message: "El correo electrónico no está registrado",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Obtenemos el nombre de usuario del usuario
  const [username] = await db.query<RowDataPacket[]>(
    "SELECT user_name FROM users WHERE id = ?",
    [id],
  );

  // Enviamos un correo electrónico al usuario con un enlace para restablecer la contraseña
  await resend.emails.send({
    from: "Polkadev <alvarobarcena@polkadev.es>",
    to: ["alvarobarcena27@gmail.com"],
    subject: "Restablece tu contraseña de Emblem",
    react: EmblemForgotPassword({
      id: id,
      username: username[0]?.user_name || "",
      updatedDate: new Date(),
    }),
  });

  // Devolvemos un mensaje de éxito
  return new Response(
    JSON.stringify({
      success: "email_sent",
      message: "El correo electrónico ha sido enviado correctamente",
      userId: id, // Devolvemos el id del usuario
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
