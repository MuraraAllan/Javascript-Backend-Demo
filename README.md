# Demo Project (Authentication)
This is a authentication endpoint over NodeJS using packages body-parser, mongoose, bcrypt, express.
It's routes are tested, and contains a basic CRUD model that respects the auth Middleware.  
Hosted on AWS EC2, read to be hosted as a container over docker, CI over Jenkins runing the lint and after runing Unit tests. As it is just a Authentication Module, has a simple Top-Down in the Unit tests that check if the middleware still working for endpoints that requires auth.  

Developed following TDD.
##

# Endpoints 

Bothe endpoints are documented.

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
Docker has no test container neither a command to force the tests to run before the application.


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
