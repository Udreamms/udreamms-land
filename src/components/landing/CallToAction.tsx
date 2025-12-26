import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-100 to-yellow-200">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-brand-navy mb-6">
          Ready to Help Someone Find Home?
        </h2>
        
        <p className="text-lg text-brand-navy/80 max-w-2xl mx-auto mb-8">
          Join hundreds of families who've found safety, support, and community with us.
        </p>
        
        <Button variant="default" size="lg" className="text-lg px-8 py-4" asChild>
          <Link href="/referral">
            <Users className="w-5 h-5 mr-2" />
            Refer Now
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;