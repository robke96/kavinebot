import mongoose from "mongoose"
import logger from "../utils/logger";

export const connectMongoDB = async (dbURI: string) => {
    try {
        await mongoose.connect(dbURI);
        logger.info("MongoDB - prisijungta prie duomenu bazes");

        return mongoose;
        } catch (error: any) {
        logger.error(`MongoDB Klaida - ${error.message}`);
    }
}