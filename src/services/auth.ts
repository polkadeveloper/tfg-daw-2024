import { Lucia } from "lucia";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import mysql from "mysql2/promise";

// Creamos una pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tfg-daw-2024"
});

// Creamos un adaptador para la base de datos
const adapter = new Mysql2Adapter(pool, {
  user: "users",
  session: "user_session"
});

// Creamos una interfaz para los atributos del usuario en la base de datos
interface DatabaseUserAttributes {
  username: string;
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD
    }
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}