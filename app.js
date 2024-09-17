import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRouter.js'

dotenv.config({
    path: './env'
})

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// cors policy
app.use(cors())

// json
app.use(express.json())

// load routes
app.use('/api/user', userRoutes);

// database connection
connectDB(DATABASE_URL)

app.listen(port, () => {
    console.log(`Server listning at http://localhost:${port}`);
})
