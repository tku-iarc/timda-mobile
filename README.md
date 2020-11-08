# timda-mobile

2020 Designed
![Timda Mobile](https://i.imgur.com/93NvHtg.png)

## Hardwares Description
| Item          	| Item Model 	| Vendor        	| Description                                                                         	|
|---------------	|------------	|---------------	|-------------------------------------------------------------------------------------	|
| Motor         	| BLVM620KM  	| Orientalmotor 	| Weight: 6kg<br> Power: 200W<br> Constant Torque: 0.65Nm<br> Constant Speed: 3000rpm 	|
| Controller    	| BLVD20KM   	| Orientalmotor 	|                                                                                     	|
| Mecanum wheel 	|            	|               	| 6 inch

## Systems
OS: Ubuntu 18.04 bionic
ROS: Melodic

## Installization and Setup
### Clone this repo and submodules
```base
$ cd $HOME
$ mkdir -p timda_mobile_ws/src && cd timda_mobile_ws
$ git clone https://github.com/tku-iarc/timda-mobile.git src/ --recursive
```
### Requirements
ROS Dependments:
```bash
$ sudo apt-get install ros-melodic-hector-sensors-description
$ sudo apt-get install ros-melodic-rosbridge-server ros-melodic-hector-slam ros-melodic-amcl ros-melodic-move-base ros-melodic-dwa-local-planner ros-melodic-map-server ros-melodic-teb-local-planner
## Hokuyo UTM30LX driver
$ sudo apt-get install ros-melodic-urg-node
```

Controller needs `libbmodbus`, please check out [mecanum](/mecanum)

Setup WoL client, we use raspberry pi 3 to send WoL signal to Intel NUC. Please check out [ping-pong client](/scripts) if needs.

There are udev files for hardware devices like Hokuyo lidar or RS485 adapter. Please check out [udev_rules](/udev_rules) and [systemd](/systemd) if needs.

We use nodeJS to setup http server. Please check out [webserver](/webserver) to install dependencies.

### Build
```base
$ cd $HOME/timda_mobile_ws
$ catkin_make
```
