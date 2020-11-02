## Steps

### To enable systemd services
```bash
$ sudo cp my-pingpong-client.service
$ sudo systemctl start my-pingpong-client.service
$ sudo journalctl -u my-pingpong-client.service
$ sudo systemctl enable my-pingpong-client.service
```
