const express = require("express");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/book.route");
const userRoutes = require("./routes/user.route");
const transactionRoutes = require("./routes/transaction.route");
const authRouters = require("./routes/auth.route");
const shopRouters = require("./routes/shop.route");
const cartRouters = require("./routes/cart.route");
const apiTransactionRoutes = require('./api/routes/transaction.route');
const apiAuthRoutes = require('./api/routes/auth.route')

const authMiddleware = require("./middleware/auth.middleware");
const isAminMiddleware = require("./middleware/isAdmin.middleware");
const sessionMiddleware = require("./middleware/session.middleware");

const app = express();
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true
});
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser("5sd5as45we4"));
app.use(sessionMiddleware);




app.get("/", authMiddleware.requireAuth, (request, response) => {
  response.render("index.pug");
});
// books
app.use("/books", bookRoutes);
// users
app.use(
  "/users",
  authMiddleware.requireAuth,
  isAminMiddleware.isAdmin,
  userRoutes
);
// transaction
app.use("/transaction", authMiddleware.requireAuth, transactionRoutes);
//auth
app.use("/auth", authRouters);
// cart
app.use("/cart", cartRouters);
// shop
app.use("/shop", shopRouters);

// api transaction
app.use('/api/transaction', apiTransactionRoutes)
//api auth
app.use('/api/auth', apiAuthRoutes)

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
