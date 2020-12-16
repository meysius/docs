# Docker
## Install
- Go to docker.com, login and download docker for mac and install it
- Open docker, click on the ship icon on mac's top bar and login
- Check if installed with `docker version`

## Images
- An image is an snapshot of the file system that can be used as hard drive of a virtual computer
- Images also have a startup command that runs after bootup
- Images can be defined using docker files or be downloaded from docker community website. 
- The first time you mention an image, docker downloads it and caches it.
- Find out what images are cached and available with `docker images`
- Community made images can be found from `hub.docker.com`.
- Each image may have many specific versions (tags)
- See all images by `docker images --all`
- Delete all by `docker rmi -f $(docker images -a -q)`

## Containers
- A container is an instance of an image whose hard drive may be in a different state due to programs executed on it
- A container will have access to a sub-set of its host's physical resources (e.g. hard, memory, cpu, network, etc.)
- This resource partitioning method is called namespacing and cgroups and is specific to linux. 
- Thats why Mac and Windows use VM to host docker ecosystem
- A container may be running or stopped
- List all running containers with `docker ps`
- List all stopped and running containers with `docker ps --all`
- Create a container from an image.
```bash
$ docker create <image_name> (<command>)?
```
- Start a stopped container
```bash
$ docker start <container_id>
```
- You can also attach to container and see its output while running
```bash
$ docker start -a <container_id>
```
- Create a container from an image and starts it while attaching to it to see its output (`-d` could make it run as a daemon in background)
```bash
$ docker run <image_name>
```
- Create a container from an image and run it with a custom startup command
```bash
$ docker run <image_name> <command>
```
- Once a container is made you cannot change its startup command
- Delete stopped container and local image cache
```bash
$ docker system prune
```
- See all the logs emitted from a container
```bash
$ docker logs <container_id>
```
- Stop a running container (gracefully)
```bash
$ docker stop <container_id>
```
- Kill a running container (immediately)
```bash
$ docker kill <container_id>
```
- Execute a command inside a running container
```bash
$ docker exec -it <container_id> <command>

# -i is to attach to the new process's stdin, and -t is to make the outputs show up in terminal exactly as is
# Example: docker exec -it <container_id> sh  # connect to command prompt
```
- Create and run a container with opening a shell as startup command
```bash
$ docker run -it <image_name> sh
```

## Dockerfile
- To make your own image, make a file in a dir named `Dockerfile` and copy below code to it:
```Dockerfile
# Specify a base image
FROM node:alpine

# Specify the work directory. Any following command will be executed relative to this dir
WORKDIR /usr/app

# Install some depenendencies
# You can use `apk` package manager to install stuff if your image is alpine based: "RUN apk add --update redis"
# Copy from local machine to image: "COPY local_path_relative_to_build_context to_image_path_relative_to_working_dir"
COPY ./package.json .
RUN npm install
COPY . .

# Default command
CMD ["npm", "start"]
```
- To select a base image, go to `hub.docker.com` click on explore
- In docker world, The leanest images are named `alpine`
- Different versions of every image are listed in "Tags" section.
- Version of an image can be alphanumerical id
- To use any base image you want do:
```Dockerfile
FROM imagename:version
```
- Build image
```bash
$ docker build .

# OR

$ docker build -f Dockerfile.dev .
```
- You can tag images when building them
```bash
$ docker build -t docker_username/a_name:a_version .
```
- If you do not specify a version, `latest` will be set by default
- In order to build an image, docker creates intermediate images with every step and caches them. Thats why in dockerfile above we first copy package.json, install node modules then copy the entire source directory. If we did not do this, everytime we made a change in source files, docker would rebuild all node modules.

- A docker file may specify multiple phases (steps). This is done when we need to install different softwares in one image and you want to bring in the result of every step into the next step. 
- Phases can be tagged using `as` which then can be used in later phases to copy files and folders over from them
```Dockerfile
FROM node:alpine as builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
```
- Every FROM statement ends the previous phase and starts a new one

## Mappings
- Mapping ports between host and the running container is a runtime thing.
- You can use below command to map you port 5000 to the running container's 3000
```bash
$ docker run -p 5000:3000 <image_name>
```
- We also can say every time container needs something in `/app` directory, reach back to directory x from the host
- This is called volume mapping and is usually done in development environment instead of copying files and folders.
- It is also necessary to sepcify exceptions when mapping volumes. For example we want to say map `/app` to folder x in host but never try to map anything agains `/app/node_modules`
```bash
$ docker run -v /app/node_modules -v $(pwd):/app <imgae_id>
```

## docker-compose file
- make a file named `docker-compose.yml`:
```yml
version: '3'
services:
  redis-server:
    image: 'redis'
  node-app:
    restart: always # this is for if it crashes or stopped, other options are: "no", always, on-failure, unless-stopped 
    build: . # Use this folder to find a dockerfile
    # OR
    build: 
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "4001:8081"
    volumes:
      - /app/node_modules
      - .:/app
    environment:
      - NAME # pull from host computer
      - NAME=something
    command: ["npm", "start"] # overriding commands
```
- The two containers above are put on the same network.
- The `node-app` container can access `redis-server` container using its name as a host name.
- `docker-compose up` will create all containers defined in compose file
- `docker-compose up -d` will run all containers defined in bg
- `docker-compose down` will stop all containers
- `docker-compose up --build` will force a rebuild
- `docker-compose ps` lists running containers of the compose file
