const express = require("express");
const cors = require('cors')
const { default: mongoose } = require("mongoose");
const authRouter = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const slideRoute = require("./routes/slideRoute");
const profileRoute = require("./routes/profileRoute");
const favoriteRoute = require("./routes/favoriteRoute");
const basketRoutes = require("./routes/basketRoutes");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors())

app.use(express.json())
app.use('/auth' , authRouter)
app.use("/profile", profileRoute);
app.use('/product' , productRoute)
app.use('/slide', slideRoute);
app.use('/uploads', express.static('uploads'));
app.use("/favorite", favoriteRoute);
app.use("/basket", basketRoutes);

const start = async () => {
  try {

    await mongoose.connect('mongodb://localhost:27017/',{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB подключен"));
    app.listen(PORT, () => {
      console.clear();
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};


start();