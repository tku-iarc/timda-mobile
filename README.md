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
### Requirements
ROS Dependments:
```bash
$ sudo apt-get install ros-melodic-hector-sensors-description
$ sudo apt-get install ros-melodic-rosbridge-server ros-melodic-hector-slam ros-melodic-amcl ros-melodic-move-base ros-melodic-dwa-local-planner ros-melodic-map-server
## Hokuyo UTM30LX driver
$ sudo apt-get install ros-melodic-urg-node
```
