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
- You can push to docker hub using:
```bash
$ docker push docker_username/a_name
```
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
EXPOSE 80  # used by Elasticbeanstack
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


## AWS Deployment
- In aws, you can set source of inbound traffic of a security group to another security group. This means whoever belongs to that security group can access entities behind this security groups.
- In order to deploy to AWS using aws-cli or ci/cd tools, you need a IAM user with deploy access.
- Using AWS Elastic Beanstack, you can deploy your single or multiple container application to one single VPS. (For multiple container deploy, Elastic Beanstack uses Elastic Container Service under the hood.
- If your project has only one Dockerfile, Elastic Beanstalk will automatically pick it up but if your project contains multiple docker files, you need to create a `Dockerrun.aws.json` file to help Elastic Beanstalk deploy your application.
```json
{
  "AWSEBDockerrunVersion": 2,
  "containerDefinitions": [
    {
      "name": "client",
      "image": "stephengrider/multi-client",
      "hostname": "client",
      "essential": false,
      "memory": 128
    },
    {
      "name": "server",
      "image": "stephengrider/multi-server",
      "hostname": "api",
      "essential": false,
      "memory": 128
    },
    {
      "name": "worker",
      "image": "stephengrider/multi-worker",
      "hostname": "worker",
      "essential": false,
      "memory": 128
    },
    {
      "name": "nginx",
      "image": "stephengrider/multi-nginx",
      "hostname": "nginx",
      "essential": true,
      "portMappings": [
        {
          "hostPort": 80,
          "containerPort": 80
        }
      ],
      "links": ["client", "server"],
      "memory": 128
    }
  ]
}
```
- `essential` flag on a container specifies whether to stop everything if that container crashes
- Unlike when you run multiple containers using docker-compose, Dockerrun file needs you to explicitly specify links between containers


## Kubernetes

### Install
- `brew install minikube`
- `brew install kubectl`
- Install virtualbox
- `minikube start`
- `minikube status` or `kubectl cluster-info` to verify
- `minikube ip` gives the ip of the cluster
- In order to connect to kubernetes docker-server using your local docker-client do `eval $(minikube docker-env)`. This only makes change to your current terminal session
- `minikube dashboard` gives u dashboard

### How it works?
- A kubernetes cluster consists of one master and multiple nodes
- Each node is a VM that can run different set of containers
- A master is a VM with softwares installed to manage nodes
- By default master decides what node should run what containers
- Master keeps a record of its current state, and a desired state
- Changes to a cluster, including deploying a newer version of an image, can be done imperatively or declaratively
- Declarative is telling cluster to change its desired states (possibly by passing a new yaml file that updates some existing configurations) - This is always prefered
- Imperative is telling cluster to make a specific change
- In dev env we use `minikube`, in production AWS EKS, Google GKE
- `minikube` create and run kubernetes cluster in your dev env
- `kubectl` interacts with kubernetes cluster and tells it what to do or run
- kubernetes expects all images to already been built. so make sure they are pushed to docker hub
- When forming a clusture, it is usually not important how many nodes this cluster will have
- minikube only runs one node for you in development, but when going to production you can have more
- What is important is a kubernetes cluster consists of multiple objects working alongside eachother
- We declare objects with config files
- Feed a yaml config to our cluster:
```bash   
$ kubectl apply -f <yaml_config>
```
- Delete an object:
```bash
$ kubectl delete -f <yaml_config>
```
- Get the status of all objects of same kind:
```bash
$ kubectl get pods
$ kubectl get services
$ kubectl get pv    ( for persistent volumes )
$ kubectl get pvc   ( for persistent volumes claims )
```
- Get info about an object:
```
$ kubectl describe <object_type>
$ kubectl describe <object_type> <object_name>
```
- Deploy latest version:
```
$ kubectl set image deployment/name container_name=docker_username/a_name:a_version
```
- Get logs for a pod:
```
$ kubectl logs pod_name
```

### Object config yaml
- An object belongs to a particular kind: Pod, Deployment, StatefulSet, ReplicaController, Service, 
- Each API version defines a different set of object kinds we can use. For example v1 has: componentStatus, Endpoints, Namespace, configMap, Event, Pod

#### Pod
- Pod is an object that runs one or more closely related containers that has to be deployed and operate together
- There are limits for what changes you can make to a Pod after its made, some changes are just not supported thus require you to delete the pod and create a new one
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: client-pod
  labels:
    component: web
spec:
  containers:
    - name: client
      image: stephengrider/multi-worker
      ports:
        - containerPort: 9999
```
- labels (may contain arbitrary key values) under metadata can be used to later select this object by other objects

#### Delpoyment
- Deployment is an object that runs (and constantly watches) one or more identical pods, by defining a pod template and killing and re-creating pods whenever changes to the template is not supported on the existing pods

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      component: postgres
  template:
    metadata:
      labels:
        component: postgres
    spec:
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: database-persistent-volume-claim
      containers:
        - name: postgres
          image: postgres
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
              subPath: postgres
          env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: pgpassword
                  key: PGPASSWORD
```

#### Volume
- Volume is an object that is tied to a specific Pod and is used to persist data. this is not good because if pod dies, data dies with it

#### PersistentVolumeClaim
- This object is used to persist data independant from a pod
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: database-persistent-volume-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
```
Three different access modes: 
  - ReadWriteOnce: can be used by a single node
  - ReadOnlyMany: many nodes can read
  - ReadWriteMany: many nodes can read and write
  
#### Secret
- This is an object used to store sensitive env variables. create a secret object imperatively:
```bash
kubectl create secret generic <secret_name> --from-literal key=value
```

#### Service
- Service is an object that sets up networking in a cluster. There are four sub-types: ClusterIP, NodePort, LoadBalancer, Ingress

#### ClusterIP
- An object that exposes a set of pods to other objects inside the cluster (not exposed to outside world)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: client-cluster-ip-service
spec:
  type: ClusterIP
  selector:
    component: web
  ports:
    - port: 3000
      targetPort: 3000
```

#### NodePort
- This object exposes a set of pods to the outside world (only good for dev purposes)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: client-node-port
spec:
  type: NodePort
  ports:
    - port: 3050
      targetPort: 3000
      nodePort: 31515
  selector:
    component: web
```
- port: a port for other pods to access what this service points to
- targetPort: the port on target pod to receive traffic
- nodePort: a port of node that is exposed to outer word (must be betweek 30000 to 32767)


#### LoadBalancer
- Legacy way of getting network traffic into a cluster.
- It can only drive traffic to one set of Pods. There is no routing functionality unlike Ingress.
- Cloud provider use their provisioned classic load balancer in the background to achieve this.

#### Ingress
- Expose a set of services to the outside world
- There are different implementation of this and we use kubernetes/ingress-nginx
- Setting this up is different depending on the environment you are running your kubernetes on
- Very similar to how Deployment is a Controller that controls Pods with template and what not, with Ingress there will also be an ingress controller and a deployment runing nginx pods
- To setup, follow instructions on the repo
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-service
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - http:
      paths:
        - path: /
          backend:
            serviceName: client-cluster-ip-service
            servicePort: 3000
```
