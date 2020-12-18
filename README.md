# Tano Systems LuCI theme
This repository contains Tano Systems theme for LuCI web configuration interface.

This theme is the official theme of the LuCI web configuration interface for [TanoWrt](https://github.com/tano-systems/meta-tano-openwrt) Linux distribution.

This theme is intended to use [forked LuCI version](https://github.com/tano-systems/luci) by Tano Systems which has a some differences in HTML markup. Therefore, this theme may not work correctly with the [official LuCI](https://github.com/openwrt/luci) and/or official [OpenWrt](https://github.com/openwrt/openwrt) builds.

The BitBake recipe for this theme can be founded in the [meta-tanowrt](https://github.com/tano-systems/meta-tanowrt/blob/master/meta-tanowrt/recipes-extended/luci-extra/luci-theme-tano.bb) OpenEmbedded layer repository.

## Development prerequisites

### Node.js and npm

To start development you should have Node.js installed on your development machine.

Depending on OS you are using you can obtain appropriate distributive or source code of Node.js from [official site](https://nodejs.org/en/download/).

Another way to get Node.js installed is by using [NVM](https://github.com/creationix/nvm) (Node Version Manager).

**It's strongly recommended to have npm of version 5 or higher** to be able to use `package-lock.json` file.

## Setting up

After Node.js and npm are installed you have to take some setup actions.

### Installing packages
All packages required for building will be installed automatically. It can take some time. Run this command to install packages.
```
npm install
```

After packages are installed you can run theme bundle building.

### Configuring env

To be able to deploy to some host having LuCI up and running you have to setup some environment variables. To get this done do the following (assuming you are in repo's root directory):
```
cp ./buildscripts/env.example ./buildscripts/env
```

Created file `./buildscripts/env` contains environment variables required for deployment of built theme to target host. All the variables are documented in place. You may use any other editor instead of `vim`.
```
vim ./buildscripts/env
```

After variables are set you may to deploy your changes to configured host.

## Running build scripts

Below described commands that allow you to build and deploy theme.

### Building and deploying theme

To get theme built and deployed you have to run this command
```
npm run build_and_deploy
```

Theme will be deployed to target host as soon as get built.

### Building theme bundle

To build a tarball that includes all theme files you have to run this command
```
npm run bundle
```

After a tarball get built it will be placed into `bundle` directory.

## Screenshots

### Desktop

#### Overview
![Overview](screenshots/desktop-overview.png?raw=true "Overview")

#### System -> General Settings
![System -> General Settings](screenshots/desktop-system.png?raw=true "System -> General Settings")

#### Firewall -> Traffic Rules
![Firewall -> Traffic Rules](screenshots/desktop-firewall.png?raw=true "Firewall -> Traffic Rules")

#### UCI Changes
![UCI Changes](screenshots/desktop-uci-changes.png?raw=true "UCI Changes")

### Mobile

#### Overview
![Overview](screenshots/mobile-overview.png?raw=true "Overview")

#### Menu
![Menu](screenshots/mobile-menu.png?raw=true "Menu")

#### System -> General Settings
![System -> General Settings](screenshots/mobile-system.png?raw=true "System -> General Settings")

#### UCI Changes
![UCI Changes](screenshots/mobile-uci-changes.png?raw=true "UCI Changes")

