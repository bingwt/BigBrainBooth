import { signIn } from "../../auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signIn }
import type { PageServerLoad } from "./$types"
 
export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth()
 
  if (!session?.user?.id) {
    redirect(303, `/login`)
  }
 
  return {
    session,
  }
}