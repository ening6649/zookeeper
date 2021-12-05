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