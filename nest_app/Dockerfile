# Base image
FROM node:18-alpine

# Create app directory
WORKDIR ./nest_app

COPY . .

# Install app dependencies
RUN yarn install
RUN yarn run build 

CMD ["yarn", "run", "start:prod"]
