# Build the app
FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable AS production

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# RUN npm install
# RUN npm run build

# Serve with nginx
# FROM nginx:latest

# Copy built files from builder
# COPY --from=builder /app/dist /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]