import { MeType } from '../types'

// Footer strip line in the style of "Läntinen Rantakatu 3 – 02 536 9445 – info@eekblom.fi"
export const buildContactLine = (me: MeType) => {
  const email = me.contacts.items
    .find(({ url }) => url.startsWith('mailto:'))
    ?.url.replace('mailto:', '')

  return ['Turku, Finland', 'github.com/perjansson', email]
    .filter(Boolean)
    .join(' – ')
}
