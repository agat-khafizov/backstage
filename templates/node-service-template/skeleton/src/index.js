const express = require('express');
const app = express();
app.get('/', (_, res) => res.send('Hello from ${{ values.name }}!'));
app.listen(3000, () => console.log('Server running on port 3000'));
