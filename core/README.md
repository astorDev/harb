# Harb

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

> Includes `--compact` option 