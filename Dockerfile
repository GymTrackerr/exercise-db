FROM node:22

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied

WORKDIR /usr/src/app/api
COPY package*.json ./
RUN npm install

# COPY config.json ./
# COPY .env .env
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

WORKDIR /usr/src/app/api
EXPOSE 3002
CMD [ "node", "./api/" ]
