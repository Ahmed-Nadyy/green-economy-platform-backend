const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require("./config/database");


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
const PORT = process.env.PORT || 5000;

sequelize
  .sync({alter:true})
  // .sync({ force: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
