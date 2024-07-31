const express = require('express');
const cors = require('cors');
const { sequelize, Sequelize } = require('./models');

const port = process.env.PORT || 8000;
const app = express();

const userRoutes = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', userRoutes);

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})