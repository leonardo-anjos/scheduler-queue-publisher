FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY package*.json ./

RUN npm install --only=production

EXPOSE 3000
CMD ["node", "dist/main"]
