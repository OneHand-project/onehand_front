import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Tag } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export const loader = async () => {
  const categories = [
    {
      id: "medical",
      name: "Medical & Health",
      description: "Medical treatments, surgeries, and health emergencies",
      icon: "🏥",
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      iconBg: "bg-red-100",
    },
    {
      id: "education",
      name: "Education",
      description: "School fees, educational programs, and learning resources",
      icon: "🎓",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconBg: "bg-blue-100",
    },
    {
      id: "emergency",
      name: "Emergency & Disaster Relief",
      description: "Natural disasters, accidents, and urgent situations",
      icon: "🚨",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      iconBg: "bg-orange-100",
    },
    {
      id: "community",
      name: "Community & Social",
      description: "Community projects, social causes, and local initiatives",
      icon: "🤝",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      iconBg: "bg-green-100",
    },
    {
      id: "arts",
      name: "Arts & Culture",
      description: "Creative projects, cultural events, and artistic endeavors",
      icon: "🎨",
      color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
      iconBg: "bg-pink-100",
    },
    {
      id: "environment",
      name: "Environment",
      description: "Environmental protection, conservation, and sustainability",
      icon: "🌱",
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
      iconBg: "bg-emerald-100",
    },
    {
      id: "technology",
      name: "Technology",
      description: "Tech projects, innovation, and digital solutions",
      icon: "💻",
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
      iconBg: "bg-indigo-100",
    },
    {
      id: "other",
      name: "Other",
      description: "Unique projects that don't fit other categories",
      icon: "✨",
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      iconBg: "bg-gray-100",
    },
  ];

  return json({ categories });
};

export default function CategoriesPage() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center space-y-4 mb-10">
        <div className="flex justify-center">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Tag className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Browse Categories</h1>
        <p className="text-slate-600">
          Explore the different types of campaigns you can support or create.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition duration-200 border-2 ${category.color}`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${category.iconBg}`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-600">{category.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
