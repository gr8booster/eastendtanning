export default function Contact() {
  return (
    <div className="min-h-screen">
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