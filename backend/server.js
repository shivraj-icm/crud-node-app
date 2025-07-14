const express   = require('express');
const dotenv    = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors')

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 


// body parser (for future POSTs)
app.use(express.json());

// mount routes
app.use('/api/users', userRoutes);



// health check
app.get('/', (req, res) => res.send('API is running'));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
