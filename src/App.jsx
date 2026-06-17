import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/ui/Navbar/Navbar.jsx'
import Hero from './components/sections/Hero/Hero.jsx'
import StatsBar from './components/sections/StatsBar/StatsBar.jsx'
import About from './components/sections/About/About.jsx'
import Experience from './components/sections/Experience/Experience.jsx'
import Projects from './components/sections/Projects/Projects.jsx'
import Skills from './components/sections/Skills/Skills.jsx'
import Education from './components/sections/Education/Education.jsx'
import Certifications from './components/sections/Certifications/Certifications.jsx'
import Achievements from './components/sections/Achievements/Achievements.jsx'
import CurrentlyBuilding from './components/sections/CurrentlyBuilding/CurrentlyBuilding.jsx'
import Contact from './components/sections/Contact/Contact'
import Footer from './components/sections/Footer/Footer';
import ProjectPage from './pages/ProjectPage';

function MainPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Certifications />
      <Achievements />
      <CurrentlyBuilding />
      <Contact />
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App