const mongoose = require('mongoose');

const connectDB = async () => {
    const maxRetries = 5;
    let retries = 0;

    const attemptConnection = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        } catch (error) {
            retries++;
            console.error(`❌ MongoDB Connection Error (attempt ${retries}/${maxRetries}): ${error.message}`);
            if (retries < maxRetries) {
                console.log(`⏳ Retrying in 5 seconds...`);
                setTimeout(attemptConnection, 5000);
            } else {
                console.error(`⚠️  MongoDB unavailable. Server running without database.`);
                console.error(`   Make sure MongoDB is running on: ${process.env.MONGO_URI}`);
                console.error(`   Install MongoDB: https://www.mongodb.com/try/download/community`);
            }
        }
    };

    await attemptConnection();
};

module.exports = connectDB;
