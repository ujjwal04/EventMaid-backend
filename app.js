const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRouter');
const User = require('./models/User');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

//Mount routes
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

app.listen(3000, () => {
  console.log('Listening at port 3000');
});
