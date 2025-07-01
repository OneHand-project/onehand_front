import { Link } from "@remix-run/react";
import { UserPlus, Search, Heart, TrendingUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Register and Create an Account",
      description:
        "Sign up to start using the platform. You can register as an organizer, donor, or volunteer.",
      icon: UserPlus,
      color: "bg-blue-500",
    },
    {
      number: "02",
      title: "Explore Campaigns",
      description:
        "Browse through our various campaigns, search by category or location, and choose one that suits your interests.",
      icon: Search,
      color: "bg-green-500",
    },
    {
      number: "03",
      title: "Participate",
      description:
        "Donate money, offer your time as a volunteer, or contribute in other ways to the campaign.",
      icon: Heart,
      color: "bg-red-500",
    },
    {
      number: "04",
      title: "Track Your Impact",
      description:
        "Monitor your contributions, see the results of the campaign, and get updates on how your support has made a difference.",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed">
              Our platform allows users to create, manage, and participate in
              campaigns. Whether you're a campaign organizer, donor, or
              volunteer, our easy-to-use features will help you make a
              difference.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-12">
            Steps to Get Started
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-8">
                    {/* Step Number */}
                    <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mb-6 relative z-10`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 relative z-10">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed relative z-10">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Progress Line - Hidden on mobile */}
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 -mt-32">
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 via-red-500 to-purple-500 rounded-full opacity-20"></div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of others who are already creating positive change
              in their communities.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to={"/auth"}>Get Started Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
