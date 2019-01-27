FROM node:11.3.0-alpine as build-stage

# Declare variables
ENV DIR /usr/src/app
ENV USER node
ENV GROUP node
ENV UID 5000
ENV GID 5000
ENV HOME /home/$USER

# Install deps
RUN apk update && apk --no-cache add \
    --virtual native-deps g++ gcc libgcc \
    libstdc++ linux-headers make python build-base \
    ffmpeg && npm install --global --quiet node-gyp \
    npm@latest yarn@latest typescript@latest

# Create the app dir and
# copy all local files to that location
RUN mkdir -p $DIR
WORKDIR $DIR
COPY . $DIR

RUN ls -la

RUN yarn

# Use node user and take ownership of pertinent dirs
RUN chown -R $USER:$USER /usr/src
RUN chown -R $USER:$USER $HOME
# Set the current user
USER $USER

RUN ls -la

EXPOSE 8080

CMD ["yarn", "start"]
