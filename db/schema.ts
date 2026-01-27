import { pgTable, serial, text, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // hashed password
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
