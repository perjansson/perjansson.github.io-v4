import { MeType } from '../types'

// mailto: href for the footer's "Email me" link
export const buildContactEmail = (me: MeType) =>
  me.contacts.items.find(({ url }) => url.startsWith('mailto:'))?.url
