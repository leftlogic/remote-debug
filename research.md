# Research

## Useful links:

Browser debugging protocols:

- [Mozilla Remote Debugging Protocol](https://wiki.mozilla.org/Remote_Debugging_Protocol)
- [Google Remote Debugging Protocol](https://developers.google.com/chrome-developer-tools/docs/protocol/1.0/index)
- [Opera Scope Transport Protocol](http://scope.bitbucket.org/scope/scope-transport-protocol.html)

Articles etc:

- [Remote Debugging in Firefox Mobile](http://lucasr.org/2012/03/28/remote-debugging-in-firefox-mobile/)
- [WebDriver API spec](http://dvcs.w3.org/hg/webdriver/raw-file/default/webdriver-spec.html)


## 12/10/12

**Chrome for Android**

- Implements the [Remote Debugging Protocol](https://developers.google.com/chrome-developer-tools/docs/protocol/1.0/index) over a WebSocket connection

**iOS 6 & Safari Web Inspector**

- iOS 6 & Safari seem to communicate via the `ubd` process, which is the Ubiquity daemon.
- The port that's consistently listed my machine is 64880.
- This conneciton exists when Safari is active, even when no remote debugging is taking place.
- Another connection seems to be set up when remote debugging another tab.

## 15/10/12

**Opera Mini & Dragonfly**

- Opening `opera:debug` on Opera Mini iOS fails, seems to not be implemented.
- The Opera Mobile Emulator works.
- Dragonkeeper acts as proxy between a host & client, designed to make developing Dragonfly itself easier.
- Got it to work so I could watch traffic between the emulator and the client. The [docs for doing so](https://github.com/operasoftware/dragonkeeper#howto) don't mention that you don't have to have a second instance of Opera, but can use the emulator too.

**General**

- Found [this Remote Debugging talk](http://thecssninja.com/talks/remote_debugging/) very useful for understanding where we stand now.
- Discovered the [WebDriver API] and the [BTTWG](http://www.w3.org/testing/browser/) – perhaps any tool that pollyfills the above should conform to this spec.