# Research

### 12/10/12

**Chrome for Android**

- Implements the [Remote Debugging Protocol](https://developers.google.com/chrome-developer-tools/docs/protocol/1.0/index) over a WebSocket connection

**iOS 6 & Safari Web Inspector**

- iOS 6 & Safari seem to communicate via the `ubd` process, which is the Ubiquity daemon.
- The port that's consistently listed my machine is 64880.
- This conneciton exists when Safari is active, even when no remote debugging is taking place.
- Another connection seems to be set up when remote debugging another tab.

### 15/10/12

**Opera Mini & Dragonfly**

- Opening `opera:debug` on Opera Mini iOS fails, seems to not be implemented.
- The Opera Mobile Emulator works.
- Dragonkeeper acts as proxy between a host & client, designed to make developing Dragonfly itself easier.
- Got it to work so I could watch traffic between the emulator and the client. The [docs for doing so](https://github.com/operasoftware/dragonkeeper#howto) don't mention that you don't have to have a second instance of Opera, but can use the emulator too.