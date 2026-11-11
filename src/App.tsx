import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";

export const App = () => (
  <>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <Nav />
    <main id="main">
      <Hero />
    </main>
  </>
);
