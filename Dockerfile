# Build the app
FROM node:slim AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve with nginx
FROM nginx:latest

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: remove default nginx.conf and use your own
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]