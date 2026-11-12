import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Statement } from "./components/Statement";
import { Work } from "./components/Work";
import { MotionLab } from "./components/MotionLab";
import { About } from "./components/About";
import { Stack } from "./components/Stack";
import { Contact } from "./components/Contact";
import { BackToTop } from "./components/BackToTop";

export const App = () => (
  <>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <Nav />
    <main id="main">
      <Hero />
      <Statement />
      <Work />
      <MotionLab />
      <About />
      <Stack />
      <Contact />
    </main>
    <BackToTop />
  </>
);
