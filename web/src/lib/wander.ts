import * as Wander from "@wander";
  
const peer = await Wander.Peer({
  namespace: "trekie.io",
  debug: true,
})

peer.authenticate({
  method: "KEY",
  secret: ""
});

function registerUser() {
  const username = "dorukeray"

  // Check if username is valid and available
  const valid = Wander.Auth.isUsernameValid(username)
  const available = await Wander.Auth.isUsernameAvailable(username)

  if (valid && available) {
    // Register the user
    const { success } = await peer.auth.register({ username })
    
    // Create a session on success
    const session = success ? peer.auth.session() : null
  }
}

