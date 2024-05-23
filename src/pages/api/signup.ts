// Importamos las funciones y tipos necesarios de nuestras dependencias
import { lucia } from "@/auth";
import { generateId } from "lucia";
import { Scrypt } from "lucia";
import { connection as db } from "@/pages/api/items";
import type { APIContext } from "astro";
import type { RowDataPacket } from "mysql2/promise";
// Importamos resend
import { Resend } from "resend";
// Importamos dotenv para poder acceder a las variables de entorno
import "dotenv/config";
// Creamos una instancia de resend
const resend = new Resend(process.env.RESEND_API_KEY);
// Importamos el Email template que hemos creado en React
import { WelcomeTemplate } from "@/components/React/emails/WelcomeTemplate";

// Definimos una función asíncrona POST que será utilizada para manejar las solicitudes POST a nuestra API
export async function POST(context: APIContext): Promise<Response> {
  // Obtenemos los datos del formulario de la solicitud
  const formData = await context.request.formData();
  const username = formData.get("username");
  const firstName = formData.get("firstname");
  const lastName = formData.get("lastname");
  const email = formData.get("email");
  const address = formData.get("address");
  const floor = formData.get("floor");
  const postalCode = formData.get("postalCode");
  const city = formData.get("city");
  const province = formData.get("province");
  const country = formData.get("country");

  // Comprobar que los datos no están vacíos
  if (
    !username || !firstName || !lastName || !email || !address ||
    !postalCode || !city || !province || !country
  ) {
    return new Response(
      JSON.stringify({
        error: "empty_fields",
        message: "Por favor, rellena todos los campos",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validamos la dirección
  if (
    typeof address !== "string" || address.length === 0 || address.length > 100
  ) {
    return new Response(
      JSON.stringify({
        error: "invalid_address",
        message: "Por favor, introduce una dirección válida",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validamos el código postal
  if (
    typeof postalCode !== "string" || postalCode.length < 5 ||
    postalCode.length > 10
  ) {
    return new Response(
      JSON.stringify({
        error: "invalid_postalCode",
        message: "Por favor, introduce un código postal válido",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validamos la ciudad
  if (typeof city !== "string" || city.length === 0 || city.length > 50) {
    return new Response(
      JSON.stringify({
        error: "invalid_city",
        message: "Por favor, introduce una ciudad válida",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validamos la provincia
  if (
    typeof province !== "string" || province.length === 0 ||
    province.length > 50
  ) {
    return new Response(
      JSON.stringify({
        error: "invalid_province",
        message: "Por favor, introduce una provincia válida",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validamos el país
  if (
    typeof country !== "string" || country.length === 0 || country.length > 50
  ) {
    return new Response(
      JSON.stringify({
        error: "invalid_country",
        message: "Por favor, introduce un país válido",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validamos el nombre de usuario
  if (
    typeof username !== "string" ||
    username.length < 6 ||
    username.length > 18 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    // Si el nombre de usuario no es válido, devolvemos un error al cliente
    return new Response(
      JSON.stringify({
        error: "invalid_username",
        message:
          "El nombre de usuario debe tener entre 6 y 18 caracteres y solo puede contener letras minúsculas, números, guiones bajos y guiones medios",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Obtenemos y validamos la contraseña
  const password = formData.get("password");
  // Regex para validar la contraseña con una longitud mínima de 8 caracteres, al menos una letra mayúscula, una letra minúscula y un dígito
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,100}$/;
  if (
    typeof password !== "string" || !passwordRegex.test(password)
  ) {
    // Si la contraseña no es válida, devolvemos un error al cliente
    return new Response(
      JSON.stringify({
        error: "invalid_password",
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un dígito",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Generamos un ID de usuario y una contraseña cifrada
  const userId = generateId(15);
  const hashedPassword = await new Scrypt().hash(password);
  console.log(hashedPassword); // Aquí puedes ver la contraseña cifrada que se almacenará en tu base de datos (¡no la muestres en producción!

  // Comprobamos si ya existe un usuario con el mismo nombre
  const [existingUser] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_name = ?",
    [username],
  );
  if (existingUser.length > 0) {
    // Si el usuario ya existe, devolvemos un error al cliente
    return new Response(
      JSON.stringify({
        error: "user_exists",
        message:
          "El nombre de usuario introducido ya existe, por favor, elige otro nombre de usuario",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validamos el email
  if (
    typeof email !== "string" ||
    email.length < 10 ||
    email.length > 100 ||
    !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
  ) {
    // Si el email no es válido, devolvemos un error al cliente
    return new Response(
      JSON.stringify({
        error: "invalid_email",
        message:
          "Por favor, introduce una dirección de correo electrónico válida",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Comprobamos si ya existe un usuario con el mismo email
  const [existingEmail] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_email = ?",
    [email],
  );

  if (existingEmail.length > 0) {
    // Si el email ya existe, devolvemos un error al cliente
    return new Response(
      JSON.stringify({
        error: "email_exists",
        message:
          "El email introducido ya está registrado, por favor, introduce otro email",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Si el usuario no existe, lo insertamos en la base de datos
  await db.query(
    "INSERT INTO users (id, user_name, user_password, first_name, last_name, user_email, address, floor, postal_code, city, province, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      userId,
      username,
      hashedPassword,
      firstName,
      lastName,
      email,
      address,
      floor,
      postalCode,
      city,
      province,
      country,
    ],
  );

  // Creamos una nueva sesión para el usuario y establecemos la cookie de sesión
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  // Enviamos un correo electrónico al usuario con un enlace para restablecer la contraseña
  await resend.emails.send({
    from: "Polkadev <alvarobarcena@polkadev.es>",
    to: [email],
    subject: "Bienvenido a tu cuenta de Emblem ",
    react: WelcomeTemplate({
      username: username,
    }),
  });

  // Devolvemos una respuesta de éxito al cliente
  return new Response(
    JSON.stringify({
      success: "account_created",
      message: "Cuenta creada con éxito!",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
