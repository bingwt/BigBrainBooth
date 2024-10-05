import { SvelteKitAuth } from "@auth/sveltekit"
import auth42 from "@auth/sveltekit/providers/42-school"
 
export const { handle, signIn } = SvelteKitAuth({
  providers: [auth42],
}) 