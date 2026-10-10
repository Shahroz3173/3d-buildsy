import { Helmet } from 'react-helmet-async'
import { SITE } from '../../data/content'

export default function SEO() {
  return (
    <Helmet>
      <title>{`${SITE.name} — ${SITE.tagline} in ${SITE.city}`}</title>
      <meta name="description" content={`Premium tiles, sanitaryware, and bathroom fittings in ${SITE.city}. Honest pricing, transparent policies, and home delivery.`} />
      <meta name="keywords" content="tiles, sanitaryware, bathroom fittings, floor tiles, wall tiles, Dehradun, Buildsy" />
      
      {/* Open Graph */}
      <meta property="og:title" content={`${SITE.name} — ${SITE.tagline}`} />
      <meta property="og:description" content={`Premium tiles and sanitaryware store in ${SITE.city}.`} />
      <meta property="og:url" content={SITE.website} />
      <meta property="og:type" content="website" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          "name": SITE.name,
          "image": "", // TODO: logo URL
          "@id": SITE.website,
          "url": SITE.website,
          "telephone": SITE.phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": SITE.address,
            "addressLocality": SITE.city,
            "addressRegion": "Uttarakhand",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "30.3164945", // TODO: real
            "longitude": "78.0321918" // TODO: real
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "10:00",
            "closes": "19:00"
          }
        })}
      </script>
    </Helmet>
  )
}
