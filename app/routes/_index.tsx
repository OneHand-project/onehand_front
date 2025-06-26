import { json, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import CampaignCard from "~/components/CampaignCard";
import CategoryCard from "~/components/Card";
import ToolBar from "~/components/ToolBar";

import styles from "~/styles/Home.module.css";

import { Campaign } from "~/types/campaign";
export const meta: MetaFunction = () => {
  return [
    { title: "OneHand" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Hero = "/assets/Hero.webp";
const Medical = "/assets/category/medic.png";
const Technology = "/assets/category/innovation.png";
const Restoring = "/assets/category/restore.png";
const Business = "/assets/category/investment.png";

export async function loader() {
  const API_URL = process.env.API_URL;
  try {
    const res = await fetch(`${API_URL}/api/campaigns/featured`);
    if (!res.ok) {
      throw json({ message: "Not found" }, { status: 404 });
    }
    const campaigns: Campaign[] = await res.json();
    return campaigns;
  } catch (e) {
    console.error(e);
    return [];
  }
}
export default function Index() {
  const campaigns = useLoaderData<typeof loader>();
  return (
    <>
      <ToolBar />
      <main className={styles.container}>
        {/* Hero section */}
        <section className={styles.herosection}>
          <picture>
            <source srcSet="Hero.webp" type="image/webp" />
            <img
              className={styles.herologo}
              src={Hero}
              alt="Hero logo"
              rel="preload"
            ></img>
          </picture>
          <div className={styles.textbox}>
            <p className={styles.maintext}>
              A Helping Hand for a Better Tomorrow
            </p>
            <p className={styles.alttext}>
              Launch a fundraiser to support the causes you care about.
            </p>
            <Link type="button" to={"/campaign/createcampaign"}>
              Start a Campaign
            </Link>
          </div>
        </section>
        {/* caregory section */}
        <section className={styles.categoriesSection}>
          <div className={styles.categtext}>
            <h2 className={styles.categtitle}>Top Categories</h2>
            <div>
              <p>
                Explore fundraiser in some of the platform&apos;s most popular
                categories.
              </p>
              <p> There is more cause you can support - just check them all.</p>
            </div>
          </div>
          <Link
            className="see-all-categories"
            style={{
              cursor: "pointer",
              fontSize: "18px",
              height: "fit-content",
              textDecoration: "underline",
              color: "#007bff",
            }}
            to={""}
          >
            See all categories
          </Link>
        </section>
        {/* categoryContainer */}
        <section className={styles.categoryScrollWrapper}>
          <div className={styles.categorycontainer}>
            <CategoryCard logo={Medical} name="Medical" />
            <CategoryCard logo={Business} name="Business" />
            <CategoryCard logo={Technology} name="Technology" />
            <CategoryCard logo={Restoring} name="Rebuild & Recover" />
          </div>
        </section>
        <section className={styles.Categcontainer}>
          <h1>Featured Campaigns</h1>
          {Array.isArray(campaigns) &&
            campaigns.map((camp) => (
              <CampaignCard key={camp.id.toString()} campaign={camp} />
            ))}
        </section>
        <section className={styles.trustworthy}>
          <h3>Fundraising on OneHand is easy, powerful, and trusted.</h3>
          <p>
            Get what you need to help your fundraiser succeed on OneHand,
            whether you’re raising money for yourself, friends, family, or
            charity. OneHand is a trusted leader in online fundraising. With
            simple pricing and a team of Trust & Safety experts in your corner,
            you can raise money or make a donation with peace of mind. memorial
            tributes and funerals to medical emergencies and nonprofits.
            Whenever you need help, you can ask here.
          </p>
        </section>
      </main>
    </>
  );
}
