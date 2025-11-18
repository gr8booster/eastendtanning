import { EnhancedSEO } from '../components/EnhancedSEO';
import { allFAQSchemas } from '../utils/faqSchemas';
import { organizationSchema, generateBreadcrumb } from '../utils/structuredData';

export default function Contact() {
  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' }
  ]);

  return (
    <div className="min-h-screen">
      {/* Enhanced SEO with 5 FAQs */}
      <EnhancedSEO
        title="Contact Eastend Tanning & Laundry - Mt Vernon OH | (740) 397-9632"
        description="Contact Eastend Tanning & Laundry in Mt Vernon, OH. Call (740) 397-9632, visit 818 Coshocton Ave, or message us. Open daily 8am-7:30pm. Questions about tanning, laundry, or Fizze drinks? We're here to help!"
        keywords="contact Eastend Mt Vernon, phone number (740) 397-9632, 818 Coshocton Ave, tanning salon contact, laundromat Mt Vernon, Fizze drinks inquiry, hours of operation, Knox County contact"
        canonicalUrl="https://eastend.website/contact"
        faqSchema={allFAQSchemas.contact}
        structuredData={[organizationSchema]}
        breadcrumbs={breadcrumbs}
        ogImage="https://eastend.website/images/eastend-hero.jpg"
      />
      
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-[linear-gradient(135deg,hsl(43_96%_96%),hsl(183_45%_96%))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <p className="text-center text-base sm:text-lg text-muted-foreground">
            Contact form coming soon! For now, please call us directly at (740) 397-9632 or visit us at 818 Coshocton Ave, Mt Vernon, OH 43050.
          </p>
        </div>
      </section>
    </div>
  );
}