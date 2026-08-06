FROM node:20-alpine

WORKDIR /app

# 1. Dépendances (mises en cache tant que package.json ne change pas)
COPY package*.json ./
RUN npm install

# 2. Code source + compilation TypeScript
COPY . .
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]