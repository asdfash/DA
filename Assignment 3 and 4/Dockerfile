FROM node:20
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN adduser -S -D -H -u 1001 -s /bin/ash appuser
EXPOSE 3000
USER appuser
CMD ["node","index.js"]
