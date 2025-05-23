const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./models');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Example: user routes
// const userRoutes = require('./routes/user.routes');
// app.use('/api/users', userRoutes);

// Database sync
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
