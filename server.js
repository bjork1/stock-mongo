const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");

const app = express();

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {

//   useNewUrlParser: true,

//   useFindAndModify: false,

// });

// var unirest = require("unirest");

// var req = unirest("GET", "https://alpha-vantage.p.rapidapi.com/query");

// req.query({
//   symbol: "NKE",
//   function: "GLOBAL_QUOTE",

// });

// req.headers({
//   "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
//   "x-rapidapi-key": "8837642bb2msh0a32e8bc2274f43p1efad7jsn770d7e11a0d0",
// });

// req.end(function (res) {
//   if (res.error) throw new Error(res.error);

//   console.log(res.body);
// });

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const databaseUrl = "notetaker";
const collections = ["notes"];

const db = mongojs(databaseUrl, collections);

db.on("error", (error) => {
  console.log("Database Error:", error);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.post("/submit", (req, res) => {
  console.log(req.body);

  db.notes.insert(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.get("/all", (req, res) => {
  db.notes.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

app.get("/find/:id", (req, res) => {
  db.notes.findOne(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.post("/update/:id", (req, res) => {
  db.notes.update(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    {
      $set: {
        title: req.body.title,
        note: req.body.note,
        average: req.body.average,
        total: req.body.total,
        modified: Date.now(),
      },
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  db.notes.remove(
    {
      _id: mongojs.ObjectID(req.params.id),
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete("/clearall", (req, res) => {
  db.notes.remove({}, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send(response);
    }
  });
});

app.listen(3000, () => {
  console.log("App running on port 3000!");
});
