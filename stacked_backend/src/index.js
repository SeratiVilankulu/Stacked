import express from "express"; // import the express package
import dotenv from "dotenv"; // import the dotenv package

dotenv.config(); // load environment variables from .env file

const app = express(); // create an instance of the express application

const PORT = process.env.PORT; // set the port to listen on
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
