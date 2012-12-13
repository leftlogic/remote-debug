# dragonkeeper

dragon keeper is a proxy between the Scope module of an Opera instance, sending and receiving STP, and an instance of the Dragonfly developer tools over HTTP.

The client is the application which uses the HTTP interface to connect to scope, the host is the Opera instance which exposes the scope interface as a STP connection.

There are two instantiations of SimpleServer to listen on the given ports for new connection, one for HTTP and the other for STP. They dispatch a connection to the appropriate classes, HTTPScopeInterface for HTTP and ScopeConnection for STP.

There are also two queues, one for HTTP and one for STP, to return a scope message to the client. The queues and scope object are shared between the HTTPScopeInterface and ScopeConnection, with the scope object handling message passing between the two.

Getting a new scope message is performed as GET request with the path /get-message. If the STP queue is not empty then the first of that queue is returned, otherwise the request is put in the HTTP waiting-queue.

If a new message arrives on the STP sockets it works the other way around: if the waiting-queue is not empty, the message is returned to the first waiting connection, otherwise it's put on the STP message queue.