export const metadata = {
  title: "Terms of Service - Resonate",
  description: "Terms of Service for Resonate Career Command Center",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-white">Terms of Service</h1>
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Acceptance of Terms
            </h2>
            <p className="leading-7">
              By accessing and using Resonate ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Use License
            </h2>
            <p className="leading-7">
              Permission is granted to temporarily use the Service for personal,
              non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may
              not:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2">
              <li>modify or copy the materials;</li>
              <li>
                use the materials for any commercial purpose or for any public
                display;
              </li>
              <li>
                attempt to decompile or reverse engineer any software contained
                on the Service;
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. User Account and Data
            </h2>
            <p className="leading-7">
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to notify us immediately of any
              unauthorized use of your account. You may delete your account and
              all associated data at any time through the settings page.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. Data Privacy and GDPR
            </h2>
            <p className="leading-7">
              We are committed to protecting your privacy. You have the right to
              access, modify, or delete your personal data at any time. Upon
              account deletion, all your data will be permanently removed from
              our systems in accordance with GDPR requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Limitations
            </h2>
            <p className="leading-7">
              In no event shall Resonate or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Revisions
            </h2>
            <p className="leading-7">
              Resonate may revise these terms of service at any time without
              notice. By using this Service you are agreeing to be bound by the
              then current version of these terms of service.
            </p>
          </section>

          <section>
            <p className="mt-8 text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


