import React from "react";
import "~/styles/CategoriesPage.css"; // Create this CSS file

const categories = [
  {
    title: "Medical",
    image: "/assets/categories/medical.jpg",
    description:
      "Support campaigns related to medical treatments and surgeries.",
  },
  {
    title: "Education",
    image: "/assets/categories/education.jpg",
    description:
      "Help students and schools access better educational resources.",
  },
  {
    title: "Environment",
    image: "/assets/categories/environment.jpg",
    description:
      "Promote campaigns for tree planting, recycling, and clean energy.",
  },
  {
    title: "Basic Needs",
    image: "/assets/categories/basic-needs.jpg",
    description: "Contribute to food, shelter, and emergency relief campaigns.",
  },
];

const CategoriesPage = () => {
  return (
    <div className="categories-page">
      <h1>Explore Campaign Categories</h1>
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <img src={cat.image} alt={cat.title} />
            <h3>{cat.title}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
