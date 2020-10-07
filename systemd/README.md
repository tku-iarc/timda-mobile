# DOES NOT WORK!!! USE robot_upstart

## Steps
### Move files to specfic path
Describe in files
### To enable systemd services
```bash
$ sudo chmod +x /usr/sbin/roslaunch
# Start services
$ sudo systemctl start roscore.service
$ sudo systemctl start roslaunch.service
# Check there are no errors w/ services
$ sudo journalctl -u roscore.service
$ sudo journalctl -u roslaunch.service
# Enable services
$ sudo systemctl enable roscore.service
$ sudo systemctl enable roslaunch.service
```
