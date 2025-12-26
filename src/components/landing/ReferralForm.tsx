const ReferralForm = () => {
  return (
    <section id="referral" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold font-playfair text-brand-navy mb-6">
            Apply or Refer a Resident
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Start the journey or refer someone today.
            <br />
            Complete the form below and our team will respond within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-4">
          <iframe
            id="JotFormIFrame-251883106378059"
            title="Referral Form"
            onLoad={() => window.parent.scrollTo(0,0)}
            allowTransparency={true}
            allow="geolocation; microphone; camera; fullscreen"
            src="https://form.jotform.com/251883106378059?isIframeEmbed=1&noBranding=1"
            frameBorder="0"
            style={{
              minWidth: '100%',
              maxWidth: '100%',
              height: '1700px',
              border: 'none',
            }}
            scrolling="no"
          />
        </div>
      </div>
    </section>
  );
};

export default ReferralForm;