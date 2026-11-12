import { useLayoutEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib/motion";
import { EDUCATION, INTERESTS } from "../content/profile";
import "../styles/about.css";

const PHOTOS = [
  {
    src: "/photos/portrait-tie.webp",
    width: 626,
    height: 1080,
    alt: "Hezekiah Asare in a white shirt and black tie, wearing glasses and holding a phone",
  },
  {
    src: "/photos/portrait-car.webp",
    width: 608,
    height: 760,
    alt: "Hezekiah Asare looking into the camera in a tan collared shirt",
  },
  {
    src: "/photos/portrait-shirt.webp",
    width: 620,
    height: 775,
    alt: "Hezekiah Asare in a white shirt, looking down while holding a phone",
  },
] as const;

const APPROACH = [
  {
    title: "The idea is mine",
    body: "I start with who it's for, how it should feel and what it should say. This portfolio began as my own written brief, from the colours to the sections to the rules about honesty.",
  },
  {
    title: "AI is how I build faster",
    body: "Claude and Kilo Code help me write and prototype quickly. I read what they produce and decide what stays.",
  },
  {
    title: "Taste isn't automated",
    body: "Picking the typeface, setting the pace, knowing when to hold back and when to make something move. Those calls are mine, and they're the part I care about most.",
  },
  {
    title: "Everything gets tested",
    body: "I check it in a real browser, on small screens and with reduced motion before I call anything done.",
  },
] as const;

export const About = () => {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.from(".about__col > *", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".about__grid", start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>(".photo").forEach((photo, index) => {
        gsap.from(photo, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "expo.out",
          delay: index * 0.1,
          scrollTrigger: { trigger: ".photos", start: "top 85%" },
        });
        // A little drift at different speeds so the strip feels layered.
        gsap.to(photo.querySelector("img"), {
          yPercent: index === 1 ? -6 : 6,
          ease: "none",
          scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      gsap.from(".approach__item", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".approach__list", start: "top 85%" },
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  return (
    <section id="about" ref={root} className="section about">
      <div className="container">
        <p className="eyebrow">About</p>
        <div className="about__grid">
          <div className="about__col">
            <h2 className="display about__title">
              A curious builder from Accra, <em>still learning.</em>
            </h2>
            <p className="about__text">
              Hi, I'm Hezekiah. I live in Accra and I'm currently serving at the Lands Commission, where I
              get hands on with IT operations.
            </p>
            <p className="about__text">
              Outside of that, I design and build websites. I'm still learning, and I'd rather be upfront about that than
              pretend to be further along than I am.
            </p>
          </div>

          <div className="about__col about__facts">
            <div>
              <h3 className="eyebrow">Education</h3>
              <ul className="facts">
                {EDUCATION.map((item) => (
                  <li key={item.place}>
                    <strong>{item.place}</strong>
                    <span>{item.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow">Experience</h3>
              <ul className="facts">
                <li>
                  <strong>Lands Commission</strong>
                  <span>Currently serving, working with IT operations</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="eyebrow">Creative interests</h3>
              <ul className="tags">
                {INTERESTS.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="eyebrow photos__label">Meet the Creator</p>
        <div className="photos">
          {PHOTOS.map((photo) => (
            <figure key={photo.src} className="photo">
              <img
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>

        <div className="approach">
          <div className="approach__head">
            <p className="eyebrow">How I work</p>
            <h3 className="display approach__title">
              Built with AI. <em>Directed by me.</em>
            </h3>
          </div>
          <ol className="approach__list">
            {APPROACH.map((item) => (
              <li key={item.title} className="approach__item">
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
