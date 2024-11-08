FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN adduser -S -D -H -u 1001 -s /bin/ash appuser
EXPOSE 3000
RUN chown -R node /usr/src/app
USER appuser
CMD ["node",'index.js']
