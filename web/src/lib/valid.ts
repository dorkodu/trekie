import z from "zod"

export const createCollection = z.object({
  projectId: sharedSchemas.uuid,
  name: z.string().min(1, "Name must be minimum 1 character.").max(64, "Name must be maximum 64 characters."),
  description: z.string().max(256, "Description must be maximum 256 characters."),
  chain: sharedSchemas.chain,
  address: sharedSchemas.address,
  tokenId: sharedSchemas.uuid,
  stakeEarnRate: z.number().min(0, "Stake earn rate must be minimum 0.").max(1_000_000, "Stake earn rate must be maximum 1,000,000.").pipe(sharedSchemas.floatNumber),
  buyLink: sharedSchemas.link,
}).strict();


const parsed = collectionSchemas.updateCollection.safeParse(arg);
if (!parsed.success) return { error: {} };