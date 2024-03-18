FROM nginx:mainline-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY certs/localhost.crt /etc/nginx/ssl/localhost.crt
COPY certs/localhost.key /etc/nginx/ssl/localhost.key
CMD [ "nginx", "-g", "daemon off;" ]