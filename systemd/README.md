## Steps

### To enable systemd services
```bash
$ sudo cp my-ldconifg-lidar.service
$ sudo systemctl start my-ldconfig-lidar.service
$ sudo journalctl -u my-ldconfig.service
$ sudo systemctl enable my-ldconfig.service
```
