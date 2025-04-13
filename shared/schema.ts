import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const blacklistedIps = pgTable("blacklisted_ips", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull().unique(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visitorLogs = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  isBot: boolean("is_bot").notNull(),
  parameters: text("parameters"),
  redirectedTo: text("redirected_to"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  imageUrl: text("image_url").notNull(),
  url: text("url").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlacklistedIpSchema = createInsertSchema(blacklistedIps).pick({
  ipAddress: true,
  userAgent: true,
});

export const insertVisitorLogSchema = createInsertSchema(visitorLogs).pick({
  ipAddress: true,
  userAgent: true,
  isBot: true,
  parameters: true,
  redirectedTo: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  category: true,
  date: true,
  imageUrl: true,
  url: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBlacklistedIp = z.infer<typeof insertBlacklistedIpSchema>;
export type BlacklistedIp = typeof blacklistedIps.$inferSelect;

export type InsertVisitorLog = z.infer<typeof insertVisitorLogSchema>;
export type VisitorLog = typeof visitorLogs.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
