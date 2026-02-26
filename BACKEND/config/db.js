const mongoose = require('mongoose');

const connectDB = async () => {
    const maxRetries = 5;
    let retries = 0;

    const attemptConnection = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 30000,
                maxPoolSize: 10,
            });
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        } catch (error) {
            retries++;
            console.error(`❌ MongoDB Connection Error (attempt ${retries}/${maxRetries}): ${error.message}`);
            if (retries < maxRetries) {
                console.log(`⏳ Retrying in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
                await attemptConnection();
            } else {
                console.error(`⚠️  MongoDB unavailable after ${maxRetries} attempts.`);
                console.error(`   MONGO_URI: ${process.env.MONGO_URI ? '***set***' : '***NOT SET***'}`);
                console.error(`   Check: 1) Atlas Network Access allows 0.0.0.0/0`);
                console.error(`   Check: 2) Username/password in URI are correct`);
                console.error(`   Check: 3) Database name is appended to URI`);
            }
        }
    };

    await attemptConnection();
};

module.exports = connectDB;
