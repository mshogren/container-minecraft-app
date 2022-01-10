---
title: "First Post"
date: 2021-11-29T09:11:45-07:00
draft: false
---

Over a year ago I bought a new server for my basement to run some media and automation services for our household.  At the time I offered to run a Minecraft server for my kids.  I was already using containers for most the the services I was running, so I did a little research and decided to use [this image](https://github.com/itzg/docker-minecraft-server) provided by [Geoff Bourne](https://github.com/itzg). That has worked out great for our children and their friends.

My kids subscribe to and watch a lot of videos by various gamers on Youtube, and I encouraged them to try out anything they felt like with my help.  The Docker image allowed them to try all kinds of servers implementing different mod and plugin APIs.  Mostly they just want to install different modpacks.  Different modpacks require different versions of the Minecraft server, which may require different versions of the Java runtime, and other configuration.  Luckily the Docker image allows specifying all that detail as environment variables.  The kids, on the other hand needed to maintain all the different versions of Minecraft and associated mods.  For this we turned to [MultiMC](https://multimc.org/).  One of the neatest features of MultiMC is the ability to add a new Minecraft instance and pick a modpack to install from a list.  The kids do this semi-regularly to checkout a modpack before they request that I setup a new server, and they are close to the point where they don't even need my help with the features of MultiMC.
<!--more-->
Seeing this in action gave me the idea for [Container Minecraft App](https://container-minecraft-app.pages.dev).  I quickly created a [Github repository](https://github.com/mshogren/container-minecraft-app), and sketched out a first attempt at a component diagram.

![First component diagram](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/mshogren/container-minecraft-app/master/docs/diagrams/firstidea.puml)

Development of this idea is only just beginning.  I am doing this in my spare time so the source code and blog may not be updated all that frequently.  I don't expect that using the app will save me any time personally, so I hardly expect to have a lot of people using it.  The real reason for doing this is to have a hands-on project to help me update my software developer skills.  I will be picking technologies and tools that I want to learn more about, like [Svelte](https://svelte.dev/) or [Vue](https://https://vuejs.org/) for the frontend, and [Python](https://www.python.org/) or [Go](https://go.dev/) to implement [GraphQL](https://graphql.org/) APIs. I also hope to learn more about different containerization technologies.
