import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

import { getAllProjects, getProjectDetails } from '../../../lib/api'
import { formatPeriodDetailed } from '../../../lib/projectHelper'
import { canonicalTech } from '../../../lib/workData'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'A project by Per Jansson'

// The image route needs its own params: the export build renders it as a
// separate static file per project, not as part of the page
export async function generateStaticParams() {
  const { data } = await getAllProjects()

  return data.projects.items.map(({ sys: { id } }) => ({ id }))
}

// Satori has no access to the stylesheet, so the palette is repeated here.
// These are the same values as globals.css.
const BG = '#ece7dd'
const PANEL = '#fbf9f4'
const INK = '#191919'
const DIM = '#655f54'

// Read off disk rather than resolved as a module: an import specifier makes
// the bundler try to treat every .woff in the package as a module, and
// satori wants the raw bytes anyway. woff, not woff2, which satori cannot
// decode.
const FONT_DIR = path.join(
  process.cwd(),
  'node_modules/@fontsource/space-mono/files'
)

const loadFont = (weight: 400 | 700) =>
  readFile(path.join(FONT_DIR, `space-mono-latin-${weight}-normal.woff`))

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [{ data }, regular, bold] = await Promise.all([
    getProjectDetails(id),
    loadFont(400),
    loadFont(700),
  ])
  const { project } = data

  // Three is what fits on one line without shrinking the type
  const tech = (project.tech ?? []).slice(0, 3).map(canonicalTech)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: BG,
          color: INK,
          fontFamily: 'Space Mono',
          padding: 44,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: PANEL,
            border: `4px solid ${INK}`,
            padding: '40px 52px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <div style={{ width: 96, height: 26, background: INK }} />
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 8 }}>
              WORK
            </div>
          </div>

          {/* Two lines of title is the tallest the panel can hold, so the
              type steps down once the name is long enough to wrap twice */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                fontSize: project.titleShort.length > 22 ? 62 : 78,
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              {project.titleShort}
            </div>
            <div style={{ display: 'flex', fontSize: 28, color: DIM }}>
              {project.client} · {project.role}
            </div>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>
              {formatPeriodDetailed(project.startdate, project.enddate)}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {tech.map((name) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  background: INK,
                  color: PANEL,
                  border: `4px solid ${INK}`,
                  padding: '8px 20px',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 3,
                }}
              >
                {name.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 26,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          <div style={{ display: 'flex' }}>PER JANSSON</div>
          <div style={{ display: 'flex', color: DIM }}>PERJANSSON.ME</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Space Mono', data: regular, weight: 400, style: 'normal' },
        { name: 'Space Mono', data: bold, weight: 700, style: 'normal' },
      ],
    }
  )
}
