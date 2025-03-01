const express = require("express");
const app = express();
const connectToMongo = require("./Database/db")
const cors = require("cors"); //Middleware to enable Cross-Origin Resource Sharing (CORS), allowing the server to handle requests from other origins.
const PORT = 2606;
const books = require("./Schema/Book");
const bookData = require("./data.json");
const cookieparser = require('cookie-parser');
const dotenv = require("dotenv");
dotenv.config();

app.use(cors({
    origin: "http://localhost:5173", // Allow only your frontend
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
}));
app.use(express.json()); //Middleware to parse incoming JSON request bodies.
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

connectToMongo();

app.use("/uploads", express.static("uploads"));
app.use("/api", require("./Routes/Auth")); //Specifies that any requests starting with /api will be routed through the Auth route module (./Routes/Auth).
app.use("/api", require("./Routes/BookForm"));
app.use("/api", require("./Routes/Addcat-subCat"));
app.use("/api", require("./Routes/ResellerPaymentForm"));
app.use("/api", require("./Routes/AddToCart"));
app.use("/api", require("./Routes/Checkout"));
app.use("/api", require("./Routes/Profile"));
app.use("/api", require("./Routes/AddRatings"));
app.use("/api", require("./Routes/SellOrders"));
app.use("/api", require("./Routes/Payment"));

app.listen(PORT,() => {
    console.log(`your application run at http://localhost:${PORT}`);
})