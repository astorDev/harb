# harb

CLI tool for basic machine metrics

```sh
>>> harb machine
{
  "cpu": {
    "used": 30.6,
    "total": 100,
    "fraction": 0.31
  },
  "ram": {
    "used": 1805336576,
    "total": 8589934592,
    "fraction": 0.21
  },
  "storage": {
    "used": 861761593344,
    "total": 1192945401856,
    "fraction": 0.72
  }
}
```

And docker containers metrics, too:

```shell
>>> harb containers
[
  {
    "id": "b8d711192541cdbb665bf0d4739391d5598ae9c8095f71739bfc761d1aea3d42",
    "name": "my-container-1",
    "cpu": 0.09,
    "ram": 77623296,
    "storage": 0
  },
  {
    "id": "853653d08b86bb44f734e6ab3356da6822fbf9f1ef674ed1feb4dac7bf8fbe9b",
    "name": "my-container-2",
    "cpu": 0.2,
    "ram": 9719808,
    "storage": 2519
  }
]
```

## Installation

> assumes npm is installed

CLI tool:

```sh
npm install --global harb-cli
```

Background jobs via PM2:

```sh
curl -sSL https://raw.githubusercontent.com/astorDev/harb/main/pm2/install.sh | sh
```
> ⚠️ `install.sh` finishes with running `pm2 startup` which sometimes only produces script you need to copy and run manually.

Executes [this script](pm2/install.sh): Installs pm2, installs harb, schedules fresh `harb-machine` job for every 5 seconds and fresh `harb-containers` for every 30 seconds. Saves the configuration and sets pm2 to run on startup
