import LegalPage from '../components/ui/LegalPage';
import PageMeta from '../components/seo/PageMeta';
import { STATIC_PAGE_META } from '../utils/seo';

export default function TermsOfServicePage() {
  const meta = STATIC_PAGE_META.terms;
  return (
    <>
      <PageMeta title={meta.title} description={meta.description} path={meta.path} />
      <LegalPage
        title="Terms of Service"
        updated="July 2026"
        intro="These Terms of Service govern your use of the Krishna Jewellers website and related enquiries. By using this site, you agree to these terms."
        sections={[
          {
            title: 'About our website',
            body: (
              <p>
                This website showcases jewellery collections, store information, and indicative metal rates for Krishna Jewellers — a jewellery house in Byasanagar, Jajpur, Odisha. Product images are for reference; actual pieces may vary slightly due to handmade craftsmanship and lighting.
              </p>
            ),
          },
          {
            title: 'Prices & rates',
            body: (
              <p>
                Gold and silver rates shown on the site are indicative and may change without notice. Final pricing is confirmed at the store based on live rates, weight, making charges, and applicable taxes. Website prices, where displayed, are estimates unless otherwise stated in writing at the time of sale.
              </p>
            ),
          },
          {
            title: 'Product availability',
            body: (
              <p>
                Designs may be limited, made to order, or subject to stock. Visiting or browsing the website does not reserve a product. Availability is confirmed when you contact or visit the store.
              </p>
            ),
          },
          {
            title: 'Acceptable use',
            body: (
              <p>
                You agree not to misuse the website, attempt unauthorized access, copy content for commercial use without permission, or submit false or harmful information through any enquiry channel.
              </p>
            ),
          },
          {
            title: 'Intellectual property',
            body: (
              <p>
                Store photographs, branding, and site content belong to Krishna Jewellers or its licensors. You may not reproduce them for commercial purposes without our prior written consent.
              </p>
            ),
          },
          {
            title: 'Limitation of liability',
            body: (
              <p>
                The website is provided for information and browsing. To the extent permitted by law, we are not liable for indirect losses arising from website use, temporary unavailability, or reliance on online information alone. In-store terms of sale apply to any purchase.
              </p>
            ),
          },
          {
            title: 'Contact',
            body: (
              <p>
                Questions about these terms can be directed to Krishna Jewellers at Byasanagar, Jajpur, Odisha – 755019.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
