import xxhash from 'xxhash-wasm'

// Create lazy-loaded hash utility
let xxhashInstance: any = null
let xxhashPromise: Promise<any> | null = null

// Initialize only when needed
const getXXHash = async () => {
  if (xxhashInstance) return xxhashInstance
  if (!xxhashPromise) {
    xxhashPromise = xxhash().then(instance => {
      xxhashInstance = instance
      return instance
    })
  }
  return xxhashPromise
}

// Modify hash function to initialize on demand
export const hash = async (status: any) => {
  const { h64ToString } = await getXXHash()
  return h64ToString(JSON.stringify(status))
}
