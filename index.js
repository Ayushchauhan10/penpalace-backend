const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
dotenv.config();
const mongoDB = require('./config/mongoDB');
const { cloudinaryConnect } = require('./config/cloudinary');
const PORT = process.env.PORT || 3000;
const userRoute = require('./route/userRoute');
const blogRoute = require('./route/blogRoute');
const commentRoute = require('./route/commentRoute');
const likeRoute = require('./route/likeRoute');

mongoDB();
cloudinaryConnect();
app.use(express.json()); // First Mistake
app.use(cookieParser());
app.use(cors());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/"
    })
);
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.use('/api/v1', userRoute);
app.use('/api/v1', blogRoute);
app.use('/api/v1', commentRoute);
app.use('/api/v1', likeRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
