import styles from "~/styles/CampaignCard.module.css";
import ProgressBar from "./PrograssBar";
import { Campaign } from "~/types/campaign";

import { BadgeCheckIcon } from "lucide-react";

import { Link } from "@remix-run/react";
import { Badge } from "./ui/badge";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link className={styles.container} to={`/campaign/${campaign.id}`}>
      <img
        className={styles.image}
        src={campaign.mainimage}
        alt="solar energy"
      />
      <section className={styles.sectioncontainer}>
        <h3 className={styles.title} style={{ paddingLeft: "20px" }}>
          {campaign.title}
        </h3>
        <div className={styles.ProgressBar}>
          <ProgressBar value={75} /> {/* 75% funded */}
        </div>
        <div className={styles.info}>
          <p>$10,000 Raised</p>
          <p>Goal: ${campaign.donationGoal}</p>
        </div>
        <div className={styles.infocontainer}>
          {/* <div className={styles.verifiedContainer}> */}
          <Badge
            variant="secondary"
            className="bg-blue-500 text-white dark:bg-blue-600"
          >
            <BadgeCheckIcon />
            Verified
          </Badge>
          {/* </div> */}
          <p>Location: {campaign.location}</p>
        </div>
      </section>
    </Link>
  );
}
