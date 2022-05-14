FROM node:14-slim

RUN npm install -g pnpm

WORKDIR /usr/src/
COPY package.json ./
RUN pnpm install
ENV PATH=/usr/src/node_modules/.bin:$PATH

WORKDIR /usr/src/app/
COPY . .
RUN mkdir -p /usr/src/app/node_modules/
RUN ln -s /usr/src/node_modules/ /usr/src/app/node_modules/

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]