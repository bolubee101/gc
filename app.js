const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
let boundary=require("./models/boundaries")
let configuration="connectionstring"

// connect to database
mongoose.connect(configuration, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("mongodb connection established");
});

// initialize app
const app = express();
app.use(
  session({
    secret: "secret-key",
    store: new MongoStore({ mongooseConnection: db }),
    resave: false,
    saveUninitialized: false,
  })
);

const PORT = process.env.PORT || 3000;

// defining the middle wares
app.use(cors());
app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({limit: '50mb'}));


app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/views/index.html")
})

app.post("/boundary",(req,res)=>{
  let link=makeid(5)
  let bound=new boundary({
    "left":req.body.left,
    "right":req.body.right,
    "bottom":req.body.bottom,
    "fontsize":req.body.fontsize,
    "color":req.body.color,
    "src":req.body.src,
    "link":link
  })
  bound.save(function(err, doc) {
    if (err) return console.error(err);
    res.json({
      "url":"generate certificates from: "+req.hostname+"/certificate/"+link
    })
  });
})

app.get("/certificate/:path",(req,res)=>{
req.session.path=req.params.path

boundary.findOne({ 'link': req.params.path }, function (err, bound) {
  if (err) return handleError(err);
  // Prints "Space Ghost is a talk show host".
 res.sendFile(__dirname+"/views/collector.html");
});

})

app.get("/details",(req,res)=>{
  boundary.findOne({ 'link': req.session.path }, 'left right bottom fontsize link src', function (err, bound) {
    if (err) return handleError(err);
    // Prints "Space Ghost is a talk show host".
    res.json(bound)
  });
})


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});



// replace with a uniqid generation module or something.
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}