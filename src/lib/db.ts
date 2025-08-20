import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not defined");

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDb(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    minPoolSize: 5,
    maxPoolSize: 20,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  const db = client.db("larrys_blog_web_app");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getUserCollection() {
  const { db } = await connectToDb();
  return db.collection("users");
}
// Add these to your existing db.ts
export async function getPostCollection() {
  const { db } = await connectToDb();
  return db.collection("posts");
}

export async function getCategoryCollection() {
  const { db } = await connectToDb();
  return db.collection("categories");
}

export async function getCommentCollection() {
  const { db } = await connectToDb();
  return db.collection("comments");
}
export async function getBookmarkCollection() {
  const { db } = await connectToDb();
  return db.collection("bookmarks");
}
