## rEquirements

| Name    | Version  |
|---------|----------|
| nvm     | 0.33.2   |
| npm     | 6.14.6   |
| node.js | v12.18.3 |

## Install NodeJS

```bash
## Install nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
## Install node.js
$ nvm install v12.18.3
## npm will be installed in the step of install node.js
```

## Install Requirements packages

```bash
$ cd myapp/
$ npm install # the installization pkgs descriped in package.json
```

## Setting systemd service for automatic startup

```bash
## Please check all the paths in my-node-app.service is correct
$ sudo cp my-node-app.service /etc/systemd/system/
$ sudo systemctl start my-node-app.service
## Check there are no error occur with the service
$ sudo journalctl -u my-node-app.service
## Enable service
$sudo systemctl enable my-node-app.service
```

## Port forwarding

Because 80 port needs permission, use iptables forward 80 port to 8080 port
```bash
$ sudo iptables-restore < my-iptables.conf
$ sudo apt-get install iptables-persistent
## Press YES while installing
## If need save new iptables, reconfigure iptables-persistent as below:
$ sudo dpkg-reconfigure iptables-persistent
```

