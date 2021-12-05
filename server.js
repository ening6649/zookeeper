const express = require('express');

const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
// chained from express.js
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
