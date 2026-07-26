import { BLOCKS, Document } from '@contentful/rich-text-types'

import {
  AllProjectsData,
  IndexPageData,
  ProjectPageData,
  ProjectType,
} from '../types'

// Sample data used only when Contentful credentials are not configured
// (e.g. local development or CI without secrets), so the site can always
// be built and previewed. Production builds read from Contentful.

const richText = (...paragraphs: string[]): { json: Document } => ({
  json: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: paragraphs.map((text) => ({
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
    })),
  } as Document,
})

const sampleProjects: ProjectType[] = [
  {
    // Promoted via the content flag so the "Highlights" section is
    // exercised in fallback builds and e2e tests too
    sys: { id: 'sample-project-1' },
    promoted: true,
    title: 'A design system and web platform for a Nordic bank',
    titleShort: 'Nordic Banking Platform',
    client: 'Sample Client One',
    description: richText(
      'A multi-year engagement building a modern customer-facing web platform, from the first architectural sketches to a design system used by a dozen teams.',
      'The work spanned frontend architecture, accessibility, performance budgets and developer experience.'
    ),
    me: richText(
      'I led the frontend work: setting the architecture, building the core of the design system and mentoring the teams adopting it.'
    ),
    role: 'Lead Frontend Developer',
    tech: ['TypeScript', 'React', 'Next.js', 'GraphQL', 'Design Systems'],
    tags: ['TypeScript', 'React', 'Next.js', 'GraphQL'],
    asset: { fileName: 'placeholder-1.svg', url: '/images/placeholder-1.svg' },
    assetPlaceholder: undefined,
    startdate: '2023-01-01',
    enddate: null,
    city: 'Helsinki',
    links: [
      { label: 'Sample Award 2025', url: 'https://example.com/award' },
      { label: 'Case study', url: 'https://example.com/case-study' },
    ],
    collaborators: {
      items: [{ name: 'Sample Collaborator', company: 'Studio North' }],
    },
  },
  {
    sys: { id: 'sample-project-2' },
    title: 'A streaming service experience for living-room devices',
    titleShort: 'Streaming for Big Screens',
    client: 'Sample Client Two',
    description: richText(
      'Building a TV application for millions of viewers, with a heavy focus on smooth navigation and startup time on low-powered devices.'
    ),
    me: richText(
      'I worked across the stack with a focus on rendering performance and the remote-control navigation model.'
    ),
    role: 'Senior Fullstack Developer',
    tech: ['React', 'Node.js', 'Performance', 'Smart TV'],
    tags: ['React', 'Node.js', 'Performance'],
    asset: { fileName: 'placeholder-2.svg', url: '/images/placeholder-2.svg' },
    assetPlaceholder: undefined,
    startdate: '2021-03-01',
    enddate: '2022-12-01',
    city: 'Stockholm',
    collaborators: { items: [] },
  },
  {
    sys: { id: 'sample-project-3' },
    title: 'Developer tooling for a fast-growing product organisation',
    titleShort: 'Developer Experience',
    client: 'Sample Client Three',
    description: richText(
      'Improving the everyday tools of a growing engineering organisation: CI pipelines, local environments and shared component libraries.'
    ),
    me: richText(
      'I paired with teams across the organisation, removing friction and automating the boring parts.'
    ),
    role: 'Consultant',
    tech: ['TypeScript', 'CI/CD', 'Tooling', 'Node.js'],
    tags: ['TypeScript', 'Tooling'],
    asset: { fileName: 'placeholder-3.svg', url: '/images/placeholder-3.svg' },
    assetPlaceholder: undefined,
    startdate: '2019-08-01',
    enddate: '2021-02-01',
    city: 'Helsinki',
    collaborators: { items: [] },
  },
]

export const fallbackIndexPageData: IndexPageData = {
  data: {
    me: {
      firstName: 'Per',
      lastName: 'Jansson',
      name: 'Per Jansson',
      title: 'Fullstack Web Developer',
      profileImage: {
        fileName: 'profile-placeholder.svg',
        url: '/images/profile-placeholder.svg',
      },
      short: richText(
        "I'm Per, a curious software developer with a passion to build great applications and websites — and help others do the same."
      ),
      long: richText(
        'For the last two decades I have helped companies large and small design, build and ship software people enjoy using.',
        'I care about the craft: readable code, fast interfaces and teams that enjoy their work.'
      ),
      contacts: {
        items: [
          { medium: 'github', url: 'https://github.com/perjansson' },
          { medium: 'linkedin', url: 'https://www.linkedin.com/in/perjansson/' },
          { medium: 'twitter', url: 'https://twitter.com/perjansson' },
          { medium: 'medium', url: 'https://medium.com/@perjansson' },
          { medium: 'email', url: 'mailto:per.jansson76@gmail.com' },
        ],
      },
    },
    projects: { items: sampleProjects },
  },
}

export const fallbackAllProjectsData: AllProjectsData = {
  data: {
    projects: {
      items: sampleProjects.map(({ sys }) => ({ sys })),
    },
  },
}

export const fallbackProjectPageData = (projectId: string): ProjectPageData => {
  const project =
    sampleProjects.find(({ sys }) => sys.id === projectId) ?? sampleProjects[0]

  return { data: { project } }
}
