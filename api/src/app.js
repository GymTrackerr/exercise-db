const express = require("express");
const app = express();
const PORT = 3002;

const routes = require('./routes/')

app.use("/", routes);

// Start server
app.listen(PORT, () =>
	console.log(`API running at http://localhost:${PORT}/v1/exercises`)
);
