// Temporary helper: prints the project catalogue so promoted/highlight
// matching can be written against real content. Run in CI where the
// Contentful secrets are available.
const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const token = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN

const query = `{
  projects: projectCollection(order: startdate_DESC) {
    items {
      sys { id }
      titleShort
      client
      role
      tech
      startdate
      enddate
    }
  }
}`

const res = await fetch(
  `https://graphql.contentful.com/content/v1/spaces/${space}`,
  {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  }
)

const { data } = await res.json()
console.log('PROJECT_DUMP_START')
console.log(JSON.stringify(data.projects.items, null, 1))
console.log('PROJECT_DUMP_END')
