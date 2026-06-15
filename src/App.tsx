import { ThemeProvider } from './context/ThemeContext';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { Grain } from './components/ui/Grain';
import { Cursor } from './components/ui/Cursor';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';

export default function App() {
  return (
    <ThemeProvider>
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <Grain />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
