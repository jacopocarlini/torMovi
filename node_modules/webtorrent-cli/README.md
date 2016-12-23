<h1 align="center">
  <br>
  <a href="https://webtorrent.io"><img src="https://webtorrent.io/img/WebTorrent.png" alt="WebTorrent" width="200"></a>
  <br>
  WebTorrent CLI
  <br>
  <br>
</h1>

<h4 align="center">The streaming torrent client. For the command line.</h4>

<p align="center">
    <a href="https://gitter.im/feross/webtorrent-cli">
        <img src="https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg"
             alt="Gitter">
    </a>
    <a href="https://travis-ci.org/feross/webtorrent-cli">
        <img src="https://img.shields.io/travis/feross/webtorrent-cli/master.svg"
             alt="Travis Build">
    </a>
    <a href="https://npmjs.com/package/webtorrent-cli">
        <img src="https://img.shields.io/npm/v/webtorrent-cli.svg"
             alt="NPM Version">
    </a>
    <a href="https://npmjs.org/package/webtorrent-cli">
        <img src="https://img.shields.io/npm/dm/webtorrent-cli.svg"
             alt="NPM Downloads">
    </a>
</p>
<br>

**WebTorrent** is the first BitTorrent client that works in the **browser**, but `webtorrent-cli`,
i.e. *THIS PACKAGE*, is for using WebTorrent from the **command line**.

`webtorrent-cli` is a simple torrent client for use in node.js, as a command line app. It
uses TCP and UDP to talk to other torrent clients.

**NOTE**: To connect to "web peers" (browsers) in addition to normal BitTorrent peers, use
[`webtorrent-hybrid`](https://github.com/feross/webtorrent-hybrid) which includes WebRTC
support for node.

To use WebTorrent in the browser, see [`webtorrent`](https://github.com/feross/webtorrent).

### Features

- **Use [WebTorrent](https://webtorrent.io) from the command line!**
- **Insanely fast**
- **Pure Javascript** (no native dependencies)
- Streaming
  - Stream to **AirPlay**, **Chromecast**, **VLC player**, and many other devices/players
  - Fetches pieces from the network on-demand so seeking is supported (even before torrent is finished)
  - Seamlessly switches between sequential and rarest-first piece selection strategy
- Supports advanced torrent client features
  - **magnet uri** support via **[ut_metadata](https://github.com/feross/ut_metadata)**
  - **peer discovery** via **[dht](https://github.com/feross/bittorrent-dht)**,
    **[tracker](https://github.com/feross/bittorrent-tracker)**, and
    **[ut_pex](https://github.com/fisch0920/ut_pex)**
  - **[protocol extension api](https://github.com/feross/bittorrent-protocol#extension-api)**
    for adding new extensions

### Install

To install a `webtorrent` command line program, run:

```bash
npm install webtorrent-cli -g
```

### Usage

```bash
$ webtorrent --help

Usage:
    webtorrent [command] <torrent-id> <options>

Example:
    webtorrent download "magnet:..." --vlc

Commands:
    download <torrent-id>   Download a torrent
    seed <file/folder>      Seed a file or folder
    create <file>           Create a .torrent file
    info <torrent-id>       Show info for a .torrent file or magnet uri

Specify <torrent-id> as one of:
    * magnet uri
    * http url to .torrent file
    * filesystem path to .torrent file
    * info hash (hex string)

Options (streaming):
    --airplay               Apple TV
    --chromecast            Chromecast
    --dlna                  DLNA
    --mplayer               MPlayer
    --mpv                   MPV
    --omx [jack]            omx [default: hdmi]
    --vlc                   VLC
    --xbmc                  XBMC
    --stdout                standard out (implies --quiet)

Options (simple):
    -o, --out [path]        set download destination [default: current directory]
    -s, --select [index]    select specific file in torrent (omit index for file list)
    -t, --subtitles [path]  load subtitles file
    -v, --version           print the current version

Options (advanced):
    -p, --port [number]     change the http server port [default: 8000]
    -b, --blocklist [path]  load blocklist file/http url
    -a, --announce [url]    tracker URL to announce to
    -q, --quiet             don't show UI on stdout
    --keep-seeding          don't quit when done downloading
    --on-done [script]      run script after torrent download is done
    --on-exit [script]      run script before program exit
    --verbose               show torrent protocol details
```

To download a torrent:

```bash
$ webtorrent magnet_uri
```

To stream a torrent to a device like **AirPlay** or **Chromecast**, just pass a flag:

```bash
$ webtorrent magnet_uri --airplay
```

In addition to magnet uris, webtorrent supports many ways to specify a torrent:

- magnet uri (string)
- torrent file (buffer)
- info hash (hex string or buffer)
- parsed torrent (from [parse-torrent](https://github.com/feross/parse-torrent))
- http/https url to a torrent file (string)
- filesystem path to a torrent file (string)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

### License

MIT. Copyright (c) [WebTorrent, LLC](https://webtorrent.io).
