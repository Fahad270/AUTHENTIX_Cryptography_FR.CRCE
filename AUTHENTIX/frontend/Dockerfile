# --- Stage 1: Build the React Application ---
FROM node:18-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

# Copy dependency manifests first for caching
COPY package*.json ./

# Install packages
RUN npm install

# Copy all frontend files explicitly
COPY . .

# Run the Vite build command
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage into nginx HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]