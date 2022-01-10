---
title: "First Release"
date: 2022-01-10T14:58:59-07:00
draft: false
---

The first release is [here](https://github.com/mshogren/container-minecraft-app/releases/tag/v0.1.0).

If you have docker you can run the app using the following command.

```sh
docker run -d -p 8000:80 -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/mshogren/container-minecraft-app:0.1.0
```

If everything goes to plan, and docker is running on localhost, the app is available by opening http://localhost:8000/ in your browser.

Pretty disappointing.

http://localhost:8000/graphql shows a little more promise.  Eventually the app will work with this graphql API to provide a useful function.  For now it is just there in case anyone wants to play around, and so I can validate my release workflow.
<!--more-->
In case things didn't go well let me explain these parts of the command.
```sh
docker run -d ghcr.io/mshogren/container-minecraft-app:0.1.0
```
is enough to run the app in the background.  In the future you may want to run the following commands to ensure you are running the latest version.
```sh
docker pull ghcr.io/mshogren/container-minecraft-app:latest
docker run -d -p 8000:80 -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/mshogren/container-minecraft-app
```
This next part is extremely important, since it allows the app to start and gather information about other docker container instances on the same machine.
```sh
-v /var/run/docker.sock:/var/run/docker.sock
```
Finally this part sets the port that the app is available on.
```sh
-p 8000:80
```
I chose 8000, because that is the default port that the development environment uses when I run the uvicorn command.  You may chose any available port.

If you notice any problems please open a [Github Issue](https://github.com/mshogren/container-minecraft-app/issues) unless there is already one for the same problem.
