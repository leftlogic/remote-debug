# Packet Sequence

- Debugger > Mobile Safari

```
{ __argument: { WIRConnectionIdentifierKey: '17858421-36EF-4752-89F7-7A13ED5782C5' },
  __selector: '_rpc_reportIdentifier:' }
```

- Mobile Safari > Debugger

```
{ __selector: '_rpc_reportSetup:',
  __argument: 
   { WIRSimulatorNameKey: 'iPhone Simulator',
     WIRSimulatorBuildKey: '10A403' } }

{ __selector: '_rpc_reportConnectedApplicationList:',
  __argument: 
   { WIRApplicationDictionaryKey: 
      { 'com.apple.mobilesafari': 
         { WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
           WIRApplicationNameKey: 'Safari',
           WIRIsApplicationProxyKey: false } } } }
```

- Debugger > Mobile Safari

```
{ __argument: 
   { WIRConnectionIdentifierKey: '17858421-36EF-4752-89F7-7A13ED5782C5',
     WIRApplicationIdentifierKey: 'com.apple.mobilesafari' },
  __selector: '_rpc_forwardGetListing:' }
```

- Mobile Safari > Debugger

```
{ __selector: '_rpc_applicationSentListing:',
  __argument: 
   { WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
     WIRListingKey: 
      { '1': 
         { WIRPageIdentifierKey: 1,
           WIRTitleKey: 'Google',
           WIRURLKey: 'http://www.google.co.uk/webhp?hl=en&tbm=isch&tab=ii' } } } }
```

- Debugger > Mobile Safari

```
{ __argument: 
   { WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
     WIRConnectionIdentifierKey: '17858421-36EF-4752-89F7-7A13ED5782C5',
     WIRSenderKey: 'DCAE5BF4-6CA4-4F37-B420-4A2A6B553D0C',
     WIRPageIdentifierKey: 1 },
  __selector: '_rpc_forwardSocketSetup:' }


{ __argument: 
   { WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
     WIRSocketDataKey: 
      { method: "Inspector.enable",
        id: 1 },
     WIRConnectionIdentifierKey: '17858421-36EF-4752-89F7-7A13ED5782C5',
     WIRSenderKey: 'DCAE5BF4-6CA4-4F37-B420-4A2A6B553D0C',
     WIRPageIdentifierKey: 1 },
  __selector: '_rpc_forwardSocketData:' }

{ __argument: 
   { WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
     WIRSocketDataKey: 
      { method: "CSS.getSupportedCSSProperties",
        id: 2 },
     WIRConnectionIdentifierKey: '17858421-36EF-4752-89F7-7A13ED5782C5',
     WIRSenderKey: 'DCAE5BF4-6CA4-4F37-B420-4A2A6B553D0C',
     WIRPageIdentifierKey: 1 },
  __selector: '_rpc_forwardSocketData:' }

{ __argument: 
   { WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
     WIRSocketDataKey: 
      { method: "Page.enable",
        id: 3 },
     WIRConnectionIdentifierKey: '17858421-36EF-4752-89F7-7A13ED5782C5',
     WIRSenderKey: 'DCAE5BF4-6CA4-4F37-B420-4A2A6B553D0C',
     WIRPageIdentifierKey: 1 },
  __selector: '_rpc_forwardSocketData:' }

{ __argument: 
   { WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
     WIRSocketDataKey: 
      { method: "Network.enable",
        id: 4 },
     WIRConnectionIdentifierKey: '17858421-36EF-4752-89F7-7A13ED5782C5',
     WIRSenderKey: 'DCAE5BF4-6CA4-4F37-B420-4A2A6B553D0C',
     WIRPageIdentifierKey: 1 },
  __selector: '_rpc_forwardSocketData:' }
```

- Mobile Safari > Debugger

```
{ __selector: '_rpc_applicationSentData:',
  __argument: 
   { WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
     WIRMessageDataKey: 
      { result: {},
        id: 1 },
     WIRDestinationKey: 'DCAE5BF4-6CA4-4F37-B420-4A2A6B553D0C' } }
```