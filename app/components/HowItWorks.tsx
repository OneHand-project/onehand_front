import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2>How It Works</h2>

      <div className="overview">
        <p>
          Our platform allows users to create, manage, and participate in
          campaigns. Whether you're a campaign organizer, donor, or volunteer,
          our easy-to-use features will help you make a difference.
        </p>
      </div>

      <div className="steps">
        <h3>Steps to Get Started</h3>

        <div className="step">
          <h4>Step 1: Register and Create an Account</h4>
          <p>
            Sign up to start using the platform. You can register as an
            organizer, donor, or volunteer.
          </p>
        </div>

        <div className="step">
          <h4>Step 2: Explore Campaigns</h4>
          <p>
            Browse through our various campaigns, search by category or
            location, and choose one that suits your interests.
          </p>
        </div>

        <div className="step">
          <h4>Step 3: Participate</h4>
          <p>
            Donate money, offer your time as a volunteer, or contribute in other
            ways to the campaign.
          </p>
        </div>

        <div className="step">
          <h4>Step 4: Track Your Impact</h4>
          <p>
            Monitor your contributions, see the results of the campaign, and get
            updates on how your support has made a difference.
          </p>
        </div>
      </div>

      <div className="cta">
        <button onClick={() => (window.location.href = "/register")}>
          Get Started Today
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
