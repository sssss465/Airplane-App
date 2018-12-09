# Airplane app - Databases final project

To start:
```
npm install
npm start
```
The data definition tables and data should be seeded into `airplaneapp`
aka `mysql -u root -p airplane < airport_solution_DDL.sql`

Open a browser and go to `localhost:3000`

## File Descriptions
We decided to split up the use cases by route handler. In the routes folder each 
respective user type has route handlers for all of their different features. Most of the routes have a query associated with them, where they either serve db information or perform a query based on user input such as in a `POST` request. Variables in the backend are passed in to the templates in the views folder via the second parameter in the `res.render('template', {foo: bar});` where we see here that foo is passed with value bar to to the template where it can be displayed

```
app.js - Most of our imports and requires() tying all of our plugins and imports together and our routes as middleware. Like the "main" of our application. Additionally our login and registration handlers are also here.

db.js - Creates a pooled request from the node-mysql driver

loggedin.js - Middleware for passport where it redirects users to where they were before they logged in.

md5.js - Computes a md5 digest for login passwords

routes
├── agent.js - All routes for agents respective use cases
├── customer.js
├── index.js - Non logged users can search here. Also the booking agent and customer can both book and search for flights respectively.
├── staff.js - All routes for airline staff
└── users.js - A file a file to test authentication ( not used in the final app)
```
## Division of labor (team project)
Some components were borrowed from each other for ease of reusablility( for example I reused Feng's bar graphs and some of his queries for the front end)

Search and User authentication - Andrew

### Customer features
View my flights - Feng

Track my spending - Feng

The rest - Andrew

### Booking agent features
View my flights - Feng

The rest - Andrew

### Staff features 

View my flights - Feng

The rest - Andrew
