FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ./assignment-1.0.0.tgz .
RUN npm install --production --silent assignment-1.0.0.tgz
COPY . .
RUN cmp node_modules/assignment/package.json package.json && \
chown -R node /app && \
chmod -R 577 /app
USER node
EXPOSE 3000
CMD ["node", "index.js"]
