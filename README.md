# Authentication Project
This is an authentication endpoint over NodeJS using packages body-parser, mongoose, bcrypt, express.
Its routes are tested and contains a basic CRUD model that respects the auth Middleware.  
Ready to be hosted as a container over docker with linter. 

Implemented using Top-Down unit tests.
Developed following TDD.

##

# Endpoints 

Both endpoints are documented.

### [user](https://github.com/MuraraAllan/Javascript-Backend-Demo/blob/master/documentation/user.md)

### [auth](https://github.com/MuraraAllan/Javascript-Backend-Demo/blob/master/documentation/auth.md)
##
## Using the project

There are 2 ways to use the project.

### Docker

Using docker-compose you can build the image of the folder and run the project, the only command you need as long as you have Docker installed is : 

```
docker-compose build && docker-compose up
```

### Locally

Download from github and run ```npm install```.
It will download the necessary package for your local machine.

###### Testing
```
npm run test
```
###### Executing Locally 

Copy the secretdocker.js to src/secret.js and change 'yoursecrethere' for your secret.   ```appSecret : yoursecrethere```

[Install mongodb](https://docs.mongodb.com/manual/installation/) and run in port 27017.

Then ```node src/server.js```.
