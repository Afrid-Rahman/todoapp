import { pgTable, serial, text, boolean, varchar, date, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),

  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  dob: date("dob"),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


import { timestamp } from "drizzle-orm/pg-core";

/* =========================
   CHAT TABLE
========================= */
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   MESSAGES TABLE
========================= */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),

  chatId: integer("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),

  role: varchar("role", { length: 10 }).notNull(), // "user" | "bot"
  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
