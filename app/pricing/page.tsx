import PricingCard from '@/components/PricingCard';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-xl text-gray-600">
            Start free. No credit card required. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <PricingCard
            plan="Free"
            price="$0"
            period="forever"
            description="Perfect for side projects, open source, and occasional releases."
            features={[
              '3 changelog generations/month',
              'Public GitHub repos only',
              'Markdown export',
              'All AI categories',
              'Copy to clipboard',
            ]}
            cta="Get Started Free"
            ctaHref="/generate"
            highlighted={false}
          />
          <PricingCard
            plan="Pro"
            price="$9"
            period="per month"
            description="For teams and active developers shipping releases frequently."
            features={[
              'Unlimited generations',
              'Public & private GitHub repos',
              'GitHub Personal Access Token support',
              'Priority AI processing',
              'Download as .md file',
              'Email support',
              'Cancel anytime',
            ]}
            cta="Upgrade to Pro"
            ctaHref="/api/stripe/checkout"
            highlighted={true}
          />
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FaqItem
              question="What counts as a generation?"
              answer="Each time you generate a changelog for a repo + tag range combination counts as one generation. You can regenerate the same range multiple times if needed."
            />
            <FaqItem
              question="Do I need a GitHub account?"
              answer="No, you can use ChangelogAI with any public GitHub repo without any account. For private repos, you'll need a GitHub Personal Access Token and a Pro plan."
            />
            <FaqItem
              question="How is my usage tracked?"
              answer="Usage is tracked per browser session using a unique ID stored in your browser's local storage. The free tier resets at the start of each calendar month."
            />
            <FaqItem
              question="Can I cancel my Pro subscription anytime?"
              answer="Yes, absolutely. You can cancel your subscription at any time from the billing portal. You'll retain Pro access until the end of your current billing period."
            />
            <FaqItem
              question="What AI model powers the changelog generation?"
              answer="We use OpenAI's GPT-4o model to analyze your commits and generate high-quality, human-readable changelogs. The AI is prompted to categorize changes, identify breaking changes, and write clearly."
            />
            <FaqItem
              question="Is my code safe?"
              answer="Yes. ChangelogAI only reads commit messages, PR titles, and tag metadata from the GitHub API. Your actual source code is never accessed or transmitted."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
  );
}
