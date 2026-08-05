import LegalPage from '../components/ui/LegalPage';
import PageMeta from '../components/seo/PageMeta';
import { STATIC_PAGE_META } from '../utils/seo';

export default function PrivacyPolicyPage() {
  const meta = STATIC_PAGE_META.privacy;
  return (
    <>
      <PageMeta title={meta.title} description={meta.description} path={meta.path} />
      <LegalPage
        title="Privacy Policy"
        updated="July 2026"
        intro="This Privacy Policy explains how Krishna Jewellers (“we”, “us”) collects and uses information when you visit our website or contact our Byasanagar showroom in Jajpur, Odisha."
        sections={[
          {
            title: 'Information we collect',
            body: (
              <p>
                We may collect details you share with us — such as your name, phone number, WhatsApp number, or message — when you enquire about jewellery, visit our showroom, or reach out through the website. Site usage data (for example page views) may also be collected through standard analytics tools.
              </p>
            ),
          },
          {
            title: 'How we use your information',
            body: (
              <p>
                We use your information to respond to enquiries, share product or rate updates you request, improve our website, and provide in-store service. We do not sell your personal information to third parties.
              </p>
            ),
          },
          {
            title: 'Sharing of information',
            body: (
              <p>
                We may share information only with trusted service providers who help us operate the website (for example hosting or messaging tools), or when required by law. These parties are expected to protect your information appropriately.
              </p>
            ),
          },
          {
            title: 'Data security & retention',
            body: (
              <p>
                We take reasonable steps to protect the information you share. We keep enquiry details only as long as needed for business or legal purposes, then securely dispose of them.
              </p>
            ),
          },
          {
            title: 'Your choices',
            body: (
              <p>
                You may ask us to update or remove your contact details from our records by calling or messaging the store. You can also choose not to provide optional information when enquiring.
              </p>
            ),
          },
          {
            title: 'Contact',
            body: (
              <p>
                For privacy-related questions, contact Krishna Jewellers, X42J+2Q2, Bank St, Dolipur, Byasanagar, Odisha 755019.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
