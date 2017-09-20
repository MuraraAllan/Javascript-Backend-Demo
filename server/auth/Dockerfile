FROM  node:8.5
# Copy contents into the gateway container
ADD /auth /gateway
# Set the working directory to   container
WORKDIR /gateway
COPY /auth/package.json /gateway/package.json
COPY /auth/secretdocker.js /gateway/secret.js
# Added node_modules to .dockerignore (size)
RUN npm install
# Define environment variable
ENV Name gateway
