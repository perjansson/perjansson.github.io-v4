export interface Article {
  title: string
  /** Slug under https://medium.com/@perjansson/ */
  slug: string
  /** Publication date, ISO. Absent when Medium does not show one. */
  date?: string
  /** What the piece is about, taken from its own title */
  topic: string
}

export const MEDIUM_PROFILE = 'https://medium.com/@perjansson'

// Per's Medium back catalogue. Kept here rather than fetched: the site is a
// static export with no server, Medium's RSS feed is not CORS-readable from
// the browser, and the list changes about once a year.
export const ARTICLES: Article[] = [
  {
    title: 'Angular dynamic page transitions for better UX',
    slug: 'angular-dynamic-page-transitions-for-better-ux-8435077c26cc',
    date: '2018-05-25',
    topic: 'Angular',
  },
  {
    title: 'An awesome yet simple grid made with CSS Grid',
    slug: 'an-awesome-yet-simple-grid-made-with-css-grid-c6d09c2cbcb0',
    date: '2018-02-01',
    topic: 'CSS Grid',
  },
  {
    title: 'A progressive image loader in React',
    slug: 'a-progressive-image-loader-in-react-f14ae652619d',
    date: '2017-12-04',
    topic: 'React',
  },
  {
    title: 'Codemods with jscodeshift',
    slug: 'codemods-with-jscodeshift-9977e646e08f',
    date: '2017-11-20',
    topic: 'jscodeshift',
  },
  {
    title: 'Browserify, modules for client side javascript',
    slug: 'browserify-modules-for-client-side-javascript-adcad130530c',
    date: '2015-06-07',
    topic: 'Browserify',
  },
  {
    title: 'Gulp, super simple workflow automator',
    slug: 'gulp-super-simple-workflow-automator-b8e33ba25957',
    date: '2015-06-05',
    topic: 'Gulp',
  },
  {
    title: 'Best hamburgers in Stockholm',
    slug: 'best-hamburgers-in-stockholm-3c1836eedbd6',
    date: '2015-01-16',
    topic: 'Stockholm',
  },
  {
    title: 'Scratching the surface of Swift',
    slug: 'scratching-the-surface-of-swift-343ddb84d08',
    date: '2015-01-07',
    topic: 'Swift',
  },
  {
    title: 'Get a good start with mob programming',
    slug: 'get-a-good-start-with-mob-programming-2e47268850b7',
    date: '2013-09-15',
    topic: 'Mob programming',
  },
  {
    title: 'Offshoring, from the Scream to friendship and success',
    slug: 'offshoring-from-the-scream-to-friendship-and-success-5b409c30d287',
    date: '2013-03-29',
    topic: 'Offshoring',
  },
  {
    // Linked from the Nordea Portfolio for Advisors project. Its date is
    // not recorded here because it was not on the profile page the rest of
    // this list came from, and a guessed date would sort the list wrong.
    title: 'How we invented and introduced drama driven demo',
    slug: 'how-we-invented-and-introduced-drama-driven-demo-9cc564bc741f',
    topic: 'Demos',
  },
]

export const articleUrl = ({ slug }: Article) => `${MEDIUM_PROFILE}/${slug}`

export const articleYear = ({ date }: Article) =>
  date ? date.slice(0, 4) : undefined
