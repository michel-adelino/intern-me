import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DemoProvider } from './demo/store'
import { About } from './pages/About'
import { Dashboard } from './pages/Dashboard'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { OpportunitiesBrowse } from './pages/OpportunitiesBrowse'
import { OpportunityDetail } from './pages/OpportunityDetail'
import { PostProject } from './pages/PostProject'
import { PostReel } from './pages/PostReel'
import { Pricing } from './pages/Pricing'
import { TalentBrowse } from './pages/TalentBrowse'

export default function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="talent" element={<TalentBrowse />} />
            <Route path="opportunities" element={<OpportunitiesBrowse />} />
            <Route path="opportunities/:id" element={<OpportunityDetail />} />
            <Route path="post-reel" element={<PostReel />} />
            <Route path="post-project" element={<PostProject />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </DemoProvider>
    </BrowserRouter>
  )
}
