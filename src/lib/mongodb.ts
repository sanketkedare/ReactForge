import dns from "node:dns";
import mongoose from "mongoose";

// Set reliable public DNS servers to resolve MongoDB SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (err) {
  // Ignore in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI || MONGODB_URI.includes("placeholder")) {
    console.warn("⚠️ [MongoDB] MONGODB_URI is not set or contains placeholder.");
    return null;
  }

  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const hostInfo = MONGODB_URI.split("@")[1]?.split("?")[0] || "Atlas Cluster";
    console.log(`🟡 [MongoDB] Connecting to ${hostInfo}...`);

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4 to bypass IPv6 DNS resolution issues
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        const dbName = m.connection.name || "reactforge";
        console.log(`🟢 [MongoDB] Connected successfully! [DB: ${dbName}]`);
        return m;
      })
      .catch((err) => {
        cached!.promise = null;
        console.error(`🔴 [MongoDB] Connection Error: ${err.message}`);
        return null;
      });
  }

  try {
    cached!.conn = await cached!.promise;
    return cached!.conn;
  } catch (e: any) {
    cached!.promise = null;
    console.error(`🔴 [MongoDB] Connection Exception: ${e.message}`);
    return null;
  }
}
