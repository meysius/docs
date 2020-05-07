# Docker

## Images
- An image is an snapshot of the file system that can be used as hard drive of a virtual computer
- Images also have a startup command that runs after bootup
- Images can be defined using docker files or be downloaded from docker community website
- Find out what images are cached and available with `docker images`
- Community made images can be found from `hub.docker.com`.
- Each image may have many specific versions (tags)

## Containers
- A container is an instance of an image whose hard drive may be in a different state due to programs executed on it
- A container may be running or stopped
- List all running containers with `docker ps`
- List all stopped and running containers with `docker ps --all`
- Create a container from an image
```
$ docker create <image_name>
```
- Start a stopped container
```
$ docker start <container_id>
```
- You can also attach to container and see its output while running
```
$ docker start -a <container_id>
```
- Create a container from an image and run it (`-d` could make it run as a daemon in background)
```
$ docker run <image_name>
```
- Create a container from an image and run it with a custom startup command
```
$ docker run <image_name> <command>
```
- Once a container is made you cannot change its startup command
- Delete stopped container and local image cache
```
$ docker system prune
```
- See all the logs emitted from a container
```
$ docker logs <container_id>
```
- Stop a running container
```
$ docker stop <container_id>
```
- Kill a running container
```
$ docker kill <container_id>
```
- Execute a command inside a running container
```
$ docker exec -it <container_id> <command>

# -i is to attach to the new process's stdin, and -t is to make the outputs show up in terminal exactly as is
# Example: docker exec -it <container_id> sh  # connect to command prompt
```
- Create and run a container with opening a shell as startup command
```
$ docker run -it <image_name> sh
```

## Making a docker image using a Dockerfile
- make a file in a dir, name it `Dockerfile`
- First specify the base image to start from: `FROM alpine`
- You then need to prepare dependencies and install packages on that image
- Install packages using `apk` if your image is alpine based:
```
RUN apk add --update redis
```
- Copy from local machine to image:
```
COPY from_path_in_local_machine to_path_in_image
```
- Specify the work directory. Any following command will be executed relative to this dir
```
WORKDIR /usr/app
```
- Specify the startup command:
```
CMD ["redis-server"]
```
- Build image
```
$ docker build .

# OR tag it while building

$ docker build -t dockerid/nameyouwant:version .
```

## Port Mapping between host computer and running container
If you want to route traffic from a port of host to certain port of the container:
```
$ docker run -p 3000:3000 <image_name>
```


## Run multiple container at the same time
- make a file named `docker-compose.yml`:
```yml
version: '3'
services:
  redis-server:
    image: 'redis'
  node-app:
    restart: always
    build: .
    ports:
      - "4001:8081"
    volumes:
      - /app/node_modules
      - .:/app
```
- The two containers above are put on the same network.
- The `node-app` container can access `redis-server` container using its name as a host name.
- `docker-compose up` will create all containers defined in compose file
- `docker-compose up -d` will run all containers defined in bg
- `docker-compose down` will stop all containers
- `docker-compose up --build` will force a rebuild
- `docker-compose ps` lists running containers of the compose file