
FROM nginx:alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy website files
COPY . /usr/share/nginx/html

# Render web service port
EXPOSE 10000

CMD ["nginx", "-g", "daemon off;"]
