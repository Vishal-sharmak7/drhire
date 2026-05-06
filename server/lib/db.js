import mongoose from 'mongoose';

const globalWithMongoose = globalThis;

if (!globalWithMongoose.__drhireMongoose) {
    globalWithMongoose.__drhireMongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose.__drhireMongoose;

export async function connectMongo() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongooseInstance) => mongooseInstance);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
