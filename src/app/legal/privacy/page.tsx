export const metadata = {
  title: "Privacy Policy - Resonate",
  description: "Privacy Policy for Resonate Career Command Center",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-white">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Information We Collect
            </h2>
            <p className="leading-7">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2">
              <li>Account information (email, name)</li>
              <li>Resume content and job application data</li>
              <li>Recruiter and contact information</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. How We Use Your Information
            </h2>
            <p className="leading-7">
              We use the information we collect to:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and generate resumes</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Data Storage and Security
            </h2>
            <p className="leading-7">
              Your data is stored securely using industry-standard encryption.
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. Your Rights (GDPR)
            </h2>
            <p className="leading-7">
              Under GDPR, you have the right to:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-4 leading-7">
              You can exercise these rights by accessing your account settings or
              contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Data Retention
            </h2>
            <p className="leading-7">
              We retain your personal data for as long as your account is active
              or as needed to provide you services. When you delete your
              account, all associated data is permanently removed from our
              systems within 30 days.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Third-Party Services
            </h2>
            <p className="leading-7">
              We use third-party services for authentication (Clerk), database
              storage (Supabase), and AI processing (Anthropic). These services
              have their own privacy policies governing the use of your
              information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              7. Changes to This Policy
            </h2>
            <p className="leading-7">
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              8. Contact Us
            </h2>
            <p className="leading-7">
              If you have any questions about this Privacy Policy, please
              contact us through your account settings or via email.
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


