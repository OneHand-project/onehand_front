interface Campaign {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  donationGoal: string;
  category: string;
  isFeatured: false;
  mainimage: string;
  multpleimages: string[];
}

export { Campaign };
