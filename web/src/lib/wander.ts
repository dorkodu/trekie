import * as Wander from "@wander";
  
const peer = await Wander.Peer({
  namespace: "trekie.io",
  debug: true,
})

peer.authenticate();