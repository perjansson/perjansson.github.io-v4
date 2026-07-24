import { getIndexPageData } from '../lib/api'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Story } from '../components/Story'
import { WorkMenu } from '../components/WorkMenu'
import { Craft } from '../components/Craft'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'

export default async function Home() {
  const { data } = await getIndexPageData()
  const { me, projects } = data

  return (
    <>
      <Header />
      <main>
        <Hero me={me} />
        <Story me={me} />
        <WorkMenu projects={projects.items} />
        <Craft projects={projects.items} />
        <Contact me={me} />
      </main>
      <Footer />
    </>
  )
}
