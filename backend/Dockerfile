FROM node:18-alpine3.15

# RUN mkdir -p ./
WORKDIR /usr/src/app

COPY . .
COPY package.json tsconfig.build.json tsconfig.json /
RUN npm install
RUN npm run build

# RUN adduser --disabled-password esolutionsTeam
# RUN chown -R esolutionsTeam:esolutionsTeam /
# USER esolutionsTeam
EXPOSE 3003
RUN npm cache clean -f
CMD ["npm","start"]