FROM node:16-alpine AS build
WORKDIR /app/frontend

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

FROM nginx:stable-alpine
COPY --from=build /app/frontend/build /use/share/nginx/html
CMD ["nginx", "-g", "daemon off"]
