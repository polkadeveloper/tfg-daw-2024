import { Lucia } from "lucia";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import mysql from "mysql2/promise";

// Creamos una pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tfg-daw-2024",
});

// Creamos un adaptador para la base de datos
const adapter = new Mysql2Adapter(pool, {
  user: "users",
  session: "user_session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.user_name,
      email: attributes.user_email,
      name: attributes.first_name,
      lastName: attributes.last_name,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// Creamos una interfaz para los atributos del usuario en la base de datos
interface DatabaseUserAttributes {
  user_name: string;
  user_email: string;
  first_name: string;
  last_name: string;
}
