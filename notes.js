const { animals } = require('./data/animals');
// get() method requires two arguments. The first is a string that describes the route the client will have to fetch from. 
// The second is a callback function that will execute every time that route is accessed with a GET request.
app.get('/api/animals', (req, res) => {
    res.send('Hello!');
  });
// below will send lots of json instead just a short message
res.json(animals)

// console.log(req.query) will return an object {name: eddie} if ?name=eddie in https
// if you repeat the same query name with different values, 
// it will become an array in the JSON. So, ?a=111&b=222&b=333 would become
{
    a: "111";
    b: ["222",  "333"];
}

// heroku create thisapp1111 (must be very unique)
// heroku git:remote -a zookeeper11
// git add. then commit then git push heroku main
// heroku login first try heroku login -i
// heroku open to see the deployed 
// git init first ! 
// git push heroku <your-feature-branchname>:main   if not main branch 

// req.params Unlike the query object, the param object needs to be defined in the route path, with <route>/:<parameterName>
// add :id to the end of the route 
// a param route must come after the other GET route
app.get('/api/animals/:id', (req, res) => {
  // findbyId will only return a single animal 
  const result = findById(req.params.id, animals);
    res.json(result);
});
// takes in the id and array of animals and returns a single animal object
// combined with the above
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    // sends a 404 error code if requested cant be found
    res.send(404);
  }
});

// app.get('/animals/:id', (req, res) => {
// })
// If the user navigates to /animals/123?id=24&params=50, what will req.params.id be?
// 123

// post to the server 
app.post('/api/animals', (req, res) => {});

app.post('/api/animals', (req, res) => {
  // req.body is where our incoming content will be
  console.log(req.body);
  res.json(req.body);
});

//"" required when using JSON data, and Insomnia will display an error if the data isn't formatted correctly
// {
//   "name": "Larry",
//   "species": "lemur",
//   "diet": "omnivore",
//   "personalityTraits": ["hungry"]
// }
// Two major differences between JSON and JavaScript object literal notation are:

// Strings must use double quotes, not single quotes.

// Names must be strings.

// in order for our server to accept incoming data the way we need it to, 
// we need to tell our Express.js app to intercept our POST request before it gets to the callback function
// parse incoming string or array data into key /value pairings that can be accessed in the req.body object
// extended:true informs the server there may be subarray data nested 
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data into req.body js objects
app.use(express.json());
// the aboves are examples of middleware functions that accept post data

// accepts the POST route's req.body value and the array we want to add the data to
function createNewAnimal(body, animalsArray) {
  console.log(body);
  // our function's main code will go here!

  // return finished code to post route for response
  return body;
}

// below gives each new animal added by a client a new unique id based on array position +1
app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  res.json(req.body);
});

app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // add animal to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);

  res.json(animal);
});

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);

  return animal;
}

// require() import data by only reading or creating a copy . but will never modify the source
//  we'll also have to import and use the fs library to write that data to animals.json

// path provides utilities for working with file and directory paths

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  // does not require a call function
  fs.writeFileSync(
    // path.join to join the value of _dirname, which represents the directory of the file we excute the code in
    // with the path to the animals.json file
    path.join(__dirname, './data/animals.json'),
    // save js array data as json, null means we dont want to edit any of exisiting data
    // if we did we d pass something in where null is
    // 2 indicates we want to create white space between our values to make it more readable
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
}

// In this case, the animal parameter is going to be the content from req.body
// validation checks
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

// '/'brings us to the root route of the server. to create a homepage for a server
app.get('/', (req, res) => {
  // instead of res.json() onnly need to display the html page res.sendfile()
  // tell them where to find the file we want our server to read and send back to the client 
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// express middleware - instructs the server to make certain files available 
app.use(express.static('public'));

// api route will deal in transference of json data
// no api only serve an HTML page
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

// wildcard route to catch requests to non-existent pages such as /about and redirect to homepage
// the order of routes matter , wildcard should always come last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// if nothing is passinto form data, the request will be GET api/animals 
// otherwise, key value pair will be the query paraemeters requested 
const getAnimals = (formData = {}) => {
  let queryUrl = '/api/animals?';

  Object.entries(formData).forEach(([key, value]) => {
    queryUrl += `${key}=${value}&`;
  });

  console.log(queryUrl);
};

