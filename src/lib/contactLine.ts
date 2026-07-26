import { ContactType, MeType } from '../types'

// mailto: href for the footer's "Email me" link
export const buildContactEmail = (me: MeType) =>
  me.contacts.items.find(({ url }) => url.startsWith('mailto:'))?.url

const HIDDEN_CHANNELS = ['stackoverflow', 'twitter', 'facebook']

// Matches "Stack Overflow", "stack-overflow", twitter.com/x.com urls etc.
const isHiddenChannel = ({ medium, url }: ContactType) => {
  const normalizedMedium = medium.toLowerCase().replace(/[^a-z0-9]/g, '')
  const normalizedUrl = url.toLowerCase()
  return HIDDEN_CHANNELS.some(
    (hidden) =>
      normalizedMedium.includes(hidden) || normalizedUrl.includes(hidden)
  )
}

/** The channels the site is willing to point at, retired networks removed */
export const visibleContacts = (me: MeType) =>
  me.contacts.items.filter(Boolean).filter((contact) => !isHiddenChannel(contact))

/** Those same channels as absolute profile URLs, for schema.org sameAs */
export const profileUrls = (me: MeType) =>
  visibleContacts(me)
    .map(({ url }) => url)
    .filter((url) => url.startsWith('http'))
