import mongoose from "mongoose";

const connectDB = async () => {
    try {
        
        mongoose.connection.on('connected', () => {
            console.log('Đã kết nối MongoDB thành công');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Lỗi kết nối MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB đã ngắt kết nối');
        });

        // Kết nối đến MongoDB cục bộ
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_db';
        await mongoose.connect(mongoURI);

    } catch (err) {
        console.error('Lỗi kết nối MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;
