FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci --no-audit --no-fund --prefer-offline

COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev"]