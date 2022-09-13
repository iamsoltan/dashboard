FROM node:14-alpine

RUN npm install -g pnpm@6.32.14


USER node

WORKDIR /groupado/payments-web

ENV NODE_ENV="dev"

ENV APP_NAME="payments-admin-web" \
    APP_VERSION="1.0.0" \
    APP_DESCRIPTION="payments-admin-web" \
    HOSTNAME="0.0.0.0" \
    PORT="3300" 

ENV NEXT_PUBLIC_PAYMENT_URL="" \
    NEXT_PUBLIC_WALLET_URL="" \
    NEXT_PUBLIC_BASE_PATH=""\
    NEXT_PUBLIC_KEYCLOAK_URL="" \
    NEXT_PUBLIC_KEYCLOAK_REALM="" \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=""


RUN pnpm install typescript 

COPY package*.json ./



RUN  time pnpm install

COPY --chown=node:node . .

RUN  time pnpm run build

EXPOSE $PORT

ENTRYPOINT [ "sh" , "launcher.sh"]

