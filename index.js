const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors= require('cors')
const userRouter = require("./routes/api2/registration");
const loginRouer = require("./routes/api2/login");
const truckRouter = require("./routes/api2/truck");
const loadRouter=require("./routes/api2/load");
const auth=require('./routes/middleware/auth')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


mongoose.connect("mongodb+srv://lenavu:server@cluster0-fpdai.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));
mongoose.set('useFindAndModify', false);

app.use(userRouter);
app.use(loginRouer);
app.use(auth)

app.use(truckRouter);
app.use(loadRouter)
app.listen(8081, () => console.log("started"));





