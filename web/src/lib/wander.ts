import * as Wander from "@wander";
  
const peer = await Wander.Peer({
  // `namespace` can also be just a string; it's used as an identifier for caches.
  // If you're developing multiple apps on the same localhost port,
  // make sure these differ.
  namespace: "trekie.io",
  debug: true,
}).catch((error) => {
  switch (error) {
    case Wander.Error.InsecureContext:
      // Wander requires HTTPS
      break;
    case Wander.Error.UnsupportedBrowser:
      // Browsers must support IndexedDB
      break;
  }
});

peer.authenticate();

// DIDs
const ourDID = await Wander.UCAN.ucan();
const otherDID = "did:key:EXAMPLE";

/**
 * The UCAN, encoded as a string.
 */
const ucan = await Wander.UCAN.build({
  audience: otherDID,
  issuer: ourDID,
  lifetimeInSeconds: 60 * 60 * 24, // expires in 24 hours
  proof: null, // or, other UCAN.
  /**
   * This can be another UCAN which has a bigger, or equal,
   * set of permissions than the UCAN we're building later.
   */
});
