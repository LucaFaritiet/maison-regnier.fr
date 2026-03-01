import Hero from "./Hero";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import CardBlock from "./CardBlock";
import Section from "./Section";
import Gallery from "./Gallery";
import Contact from "./Contact";

export const widgetRegistry = {
  hero: Hero,
  text: TextBlock,
  image: ImageBlock,
  card: CardBlock,
  section: Section,
  gallery: Gallery,
  contact: Contact,
};