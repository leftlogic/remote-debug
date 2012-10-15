# Research

### 12/10/12

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