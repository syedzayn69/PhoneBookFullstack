const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());
require("dotenv").config();

const People = require("./model/phonebook");

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Mario Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/persons/:id", (request, response, next) => {
  People.findById(request.params.id)
    .then((res) => {
      if (res) {
        response.json(res);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has onfo for ${People.length} people </br> ${Date()}`
  );
});

app.get("/api/persons", (request, response) => {
  People.find({}).then((res) => {
    response.json(res);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  People.findByIdAndDelete(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((results) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// DEFINING CUSTOM TOKENS IN MORGAN
// eslint-disable-next-line no-unused-vars
morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
});
////

app.post(
  "/api/persons",
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  ),
  (request, response, next) => {
    // console.log(request.headers)  // TO CHECK HEADER TYPE
    const body = request.body;
    const newContact = new People({
      name: body.name,
      number: body.number,
    });
    // CHECK CONDITIONS
    {
      if (contacts.find((elem) => body.name === elem.name)) {
        return response.status(400).json({
          error: "Contact Already Exists!",
        });
      } else if (body.name === "") {
        return response.status(400).json({
          error: "Empty field not acceptable as Name",
        });
      } else if (body.number === "") {
        return response.status(400).json({
          error: "Empty field not acceptable as Number",
        });
      }
    }
    newContact
      .save()
      .then((result) => {
        console.log("contact saved!");
        response.json(result);
      })
      .catch((error) => next(error));
  }
);
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };
  People.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((results) => {
      if (results) {
        response.json(person);
      } else {
        response.status(400).end();
      }
    })
    .catch((error) => next(error));
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndPoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).end();
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);
// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
