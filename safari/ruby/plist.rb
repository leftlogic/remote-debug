require 'socket'
require 'CFPropertyList'
require 'uuid'

uuid = UUID.new

s = Socket.new Socket::PF_INET6, Socket::SOCK_STREAM
s.connect Socket.pack_sockaddr_in(27753, '::1')

def send(s, data)
  plist = CFPropertyList::List.new
  plist.value = CFPropertyList.guess(data)
  s.write [plist.to_str.length].pack('N')
  s.write plist.to_str
  puts plist.to_str
end

id = uuid.generate

puts 'Connected'

send(s, {
  '__argument' => {
    'WIRConnectionIdentifierKey' => id
  },
  '__selector' => '_rpc_reportIdentifier:'
})

# send(s, {
#   '__argument' => {
#     'WIRConnectionIdentifierKey' => id,
#     'WIRConnectionIdentifierKey' => 'com.apple.mobilesafari'
#   },
#   '__selector' => '_rpc_forwardGetListing:'
# })

while line = s.gets
  puts 'msg'
  puts line
end

s.close