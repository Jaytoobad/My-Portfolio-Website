import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Statement } from "./components/Statement";
import { Work } from "./components/Work";

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
    </main>
  </>
);
