## 0.1

- Successfully connect to all target browsers
- Send abritrary JavaScript (i.e. an alert) to the target device from the command line
- Repeat process (proving that the target hasn't been corrupted somehow)
- Targets: MobileSafari, Firefox Beta, Opera Mobile, Chrome
- Both simulators *and* hardware targets must work (MobileSafari over USB in particular)

### TODO

- Explore IE10 mobile support - unsure if remote debugging is event supported...

## 0.2

- Create **thin** (read: incomplete) translation layer between DevTools and all targets
- Translate commands from DevTools' console to run on specified (i.e. hardcoded) targets
- Automatically detect available targets and list (on a terminal interface)
- ...

## 0.x

- Dynamically load remote DevTools front end (or revert to local copy if no Internet connection)
- Create interface (in DevTools) to select automatically detected target device and specific open tab/page
- Create communication layer between DevTools and non-native targets
- No requirements on `adb` or other command line tools except for our single remote debugger application
- Self upgrading software

## 1.0

- Party time :party:

## 1.x

- Intercept service that converts JavaScript to [Ardwolf](https://github.com/lexandera/Aardwolf) custom debugging solution
- Support devices with non-native remote debugging protocol with:
  * Ardwolf
  * Weinre (needs upgrading to WebSockets)
  * JS Console (or upgrade Weinre console to include better error handling - probably preferable)
  * XHR debugging (Firebug lite used to do this I think)
  * Network debugging - is this at all possible?
