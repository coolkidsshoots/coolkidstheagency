import { getMedia } from "../lib/media";
import Portfolio from "../components/Portfolio";

const SITE = "https://www.coolkidstheagency.com";

// Tells Google who we are: the business name, site, logo, contact and Instagram.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cool Kids The Agency",
  alternateName: "Cool Kids",
  url: SITE,
  logo: `${SITE}/logo.png`,
  email: "contact@coolkidstheagency.com",
  telephone: "+447385794068",
  description: "A creative agency of a filmmaker and a photographer, capturing sport in style.",
  sameAs: ["https://instagram.com/coolkidstheagency"],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Portfolio media={getMedia()} />
    </>
  );
}
