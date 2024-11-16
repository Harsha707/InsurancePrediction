# frontend/Dockerfile
FROM node:16 

WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install 

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
