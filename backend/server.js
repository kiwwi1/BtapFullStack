import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import Student from './models/Student.js';

const app = express();
const port = process.env.PORT || 5000;

// Kết nối MongoDB
connectDB();

// Middlewares
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));
app.use(express.json());

// Route test
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// Bài 1: Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bài 2: Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Bài 3: Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);   
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bài 4: Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Sinh viên đã được xóa' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

