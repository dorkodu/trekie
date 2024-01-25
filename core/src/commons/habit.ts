import { EventKind } from "#/lib/supercell"

const kinds = {
  "habit:create": EventKind({
    onCreate(data) {
      return {
        kind: "habit:create"
      }
    },
    onShare(status) {

    },
  })
}


export default {}

/**
 * 
 * EventKind<{ title: string, description: string }>
 */