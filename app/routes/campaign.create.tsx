import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Link,
  redirect,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  Clock,
  DollarSign,
  Eye,
  Globe,
  ImageIcon,
  MapPin,
  Quote,
  Save,
  Tag,
  Target,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Editor } from "~/components/createcampaign/TextEditor";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { cn } from "~/lib/utils";
import styles from "~/styles/CreateCampaign.css?url";
import variables from "@/styles/_variables.scss?url";
import keyframe from "@/styles/_keyframe-animations.scss?url";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { Separator } from "@radix-ui/react-separator";

import { Textarea } from "~/components/ui/textarea";
import { Calendar } from "~/components/ui/calendar";
import { authCookie } from "~/utils/cookies.server";
import { Switch } from "@radix-ui/react-switch";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: variables },
  { rel: "stylesheet", href: keyframe },
];

const steps = [
  { id: 1, title: "Category", description: "Choose campaign type", icon: Tag },
  { id: 2, title: "Basic Info", description: "Campaign details", icon: Target },
  {
    id: 3,
    title: "Media & Options",
    description: "Image & volunteers",
    icon: ImageIcon,
  },
  { id: 4, title: "Description", description: "Rich content", icon: Quote },
];

const categoriesWithDetails = [
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

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await authCookie.parse(cookieHeader);

  if (!token) return redirect("/auth");

  return json({ token });
}
export default function CreateCampaign() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    donationGoal: "",
    country: "",
    city: "",
    shortDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setdescription] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [enableVolunteers, setEnableVolunteers] = useState(false);
  const [imageError, setImageError] = useState("");

  const validateMediaStep = () => {
    if (!mainImage) {
      setImageError("Campaign image is required");
      return false;
    }
    setImageError("");
    return true;
  };

  const API_URL = "http://134.122.95.126:8080";

  const { token } = useLoaderData<typeof loader>();
  const [hydrated, sethydrated] = useState(false);
  useEffect(() => {
    sethydrated(true);
  }, []);

  if (!hydrated) {
    return null; // or loading UI
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size should be less than 5MB");
      return;
    }

    setImageError("");
    setMainImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setMainImage(null);
    setImagePreview("");
    setImageError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Campaign title is required";
    if (!formData.donationGoal.trim())
      newErrors.goal = "Donation goal is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!date) newErrors.date = "Campaign end date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!selectedCategory) {
        // Show error for category selection
        return;
      }

      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateForm()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (validateMediaStep()) {
        setCurrentStep(4);
      }
    } else if (currentStep == steps.length) {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append("category", selectedCategory);
      data.append("date", date?.toISOString().split("T")[0] || "");
      data.append("location", `${formData.country},${formData.city}`);
      data.append("description", description.toString());
      if (mainImage) {
        data.append("main", mainImage);
      }
      data.append("isvolunteer", enableVolunteers ? "true" : "false");

      if (date) data.append("date", date?.toISOString().split("T")[0] || "");
      try {
        const res = await fetch(`${API_URL}/api/campaigns/create`, {
          method: "POST",
          credentials: "include",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return json({ error: "failed to create campaign" });
        navigate("/", { replace: true });
      } catch (e) {
        console.error(e);
      }
    }
    return redirect("/");
  };
  const renderMediaAndOptions = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <ImageIcon className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Media & Campaign Options
          </h2>
          <p className="text-sm text-slate-500">
            Upload your main campaign image and configure additional options
          </p>
        </div>
      </div>

      {/* Main Image Upload */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Main Campaign Image
          <span className="text-slate-400 font-normal ml-2">(Required)</span>
        </Label>

        {!imagePreview ? (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-full">
                <Upload className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-600 font-medium">
                  Upload campaign image
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  PNG, JPG, GIF up to 5MB. Recommended size: 1200x600px
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose Image
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden border border-slate-200">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Campaign preview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Change Image
                </Button>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="absolute top-2 right-2 gap-1 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <X className="w-4 h-4" />
              Remove
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}

        {imageError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {imageError}
          </div>
        )}
      </div>

      {/* Volunteer Option */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Volunteer Support
        </Label>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium text-slate-900">
                  Enable Volunteer Support
                </h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Allow people to volunteer their time and skills to help your
                campaign succeed. Volunteers can offer services like marketing,
                design, technical support, or physical assistance.
              </p>

              <div className="flex items-center gap-3">
                <Switch
                  id="enable-volunteers"
                  checked={enableVolunteers}
                  onCheckedChange={setEnableVolunteers}
                  className="bg-gray-800"
                />
                <Label
                  htmlFor="enable-volunteers"
                  className="text-sm font-medium"
                >
                  {enableVolunteers
                    ? "Disable volunteers"
                    : "Enable Volunteers"}
                </Label>
              </div>
            </div>
          </div>

          {enableVolunteers && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-green-900">
                    Volunteer support enabled!
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your campaign will show a Volunteer button alongside the
                    donation button. People can sign up to help with various
                    tasks and you&apos;ll receive their contact information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Campaign Preview
        </h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {imagePreview && (
            <div className="aspect-video bg-slate-100">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Campaign preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h4 className="font-semibold text-slate-900 mb-2">
              {formData.title || "Your Campaign Title"}
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              {formData.shortDescription ||
                "Your campaign description will appear here..."}
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                Donate Now
              </Button>
              {enableVolunteers && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Users className="w-4 h-4" />
                  Volunteer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-8">
      {/* Campaign Overview */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Campaign Overview
            </h2>
            <p className="text-sm text-slate-500">
              Tell us about your campaign goals and basic information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Title */}
          <div className="lg:col-span-2 space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-slate-700 flex items-center gap-2"
            >
              Campaign Title
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            </Label>
            <Input
              id="title"
              placeholder="Enter a compelling campaign title..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={cn(
                "h-12 text-base",
                errors.title && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.title && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </div>
            )}
          </div>

          {/* Donation Goal */}
          <div className="space-y-2">
            <Label
              htmlFor="goal"
              className="text-sm font-medium text-slate-700 flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Donation Goal
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            </Label>
            <Input
              id="goal"
              type="number"
              placeholder="10000"
              value={formData.donationGoal}
              onChange={(e) =>
                setFormData({ ...formData, donationGoal: e.target.value })
              }
              className={cn(
                "h-12 text-base",
                errors.goal && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.goal && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.goal}
              </div>
            )}
          </div>

          {/* Campaign End Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Campaign End Date
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full justify-start text-left font-normal text-base",
                    !date && "text-muted-foreground",
                    errors.date && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.date}
              </div>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Country
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            </Label>
            <Input
              id="country"
              placeholder="Enter country name..."
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className={cn(
                "h-12 text-base",
                errors.country && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.country && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.country}
              </div>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="text-sm font-medium text-slate-700 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              City
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            </Label>
            <Input
              id="city"
              placeholder="Enter city name..."
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className={cn(
                "h-12 text-base",
                errors.city && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.city && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.city}
              </div>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <Label
            htmlFor="shortDescription"
            className="text-sm font-medium text-slate-700"
          >
            Short Description
            <span className="text-slate-400 font-normal ml-2">(Optional)</span>
          </Label>
          <Textarea
            id="shortDescription"
            placeholder="Provide a brief summary of your campaign (max 200 characters)..."
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            className="min-h-[100px] text-base resize-none"
            maxLength={200}
          />
          <div className="text-xs text-slate-400 text-right">
            {formData.shortDescription.length}/200 characters
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Form Completion</span>
          <span className="font-medium text-slate-900">
            {Math.round(
              ((Object.values(formData).filter((v) => v.trim()).length +
                (date ? 1 : 0)) /
                6) *
                100
            )}
            %
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(
                ((Object.values(formData).filter((v) => v.trim()).length +
                  (date ? 1 : 0)) /
                  6) *
                  100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
  const renderCategorySelection = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Tag className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Choose Your Campaign Category
          </h2>
          <p className="text-slate-600 mt-2">
            Select the category that best describes your campaign to help people
            find it
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriesWithDetails.map((category) => (
          <button
            key={category.id}
            className={`
              relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${
                selectedCategory === category.id
                  ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20"
                  : category.color
              }
            `}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${category.iconBg}`}
              >
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {category.description}
                </p>
              </div>
            </div>
            {selectedCategory === category.id && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="bg-indigo-50 rounded-lg !p-4 !mt-4  border border-indigo-200">
          <div className="flex items-start gap-3 ">
            <div className="p-1 bg-indigo-100 rounded">
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-indigo-900">Great choice!</h4>
              <p className="text-sm text-indigo-700 mt-1">
                You`&apos`ve selected
                <strong>
                  {
                    categoriesWithDetails.find((c) => c.id === selectedCategory)
                      ?.name
                  }
                </strong>
                . This will help people interested in this type of campaign find
                your project more easily.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTextEditor = () => {
    return (
      <div className="h-full">
        <Editor
          onUpdate={(html) => {
            setdescription(html);
          }}
          token={token}
        />
      </div>
    );
  };
  return (
    <div className="container">
      <div className="header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={"/"}
                className="gap-2 flex flex-row justify-center items-center"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Campaigns
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold text-slate-900">
                Create Campaign
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* step navigation */}
      <div className="stepnav">
        <div className="contentcontainer">
          {/* Step Navigation */}
          <div className="stepcontainer">
            <div className="flex items-center justify-between max-w-2xl mx-auto ">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                              ${
                                currentStep >= step.id
                                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                                  : "bg-slate-100 text-slate-400"
                              }
                            `}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="mt-3 text-center">
                        <div
                          className={`text-sm font-medium ${
                            currentStep >= step.id
                              ? "text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`
                              w-24 h-0.5 mx-6 transition-all duration-300
                              ${
                                currentStep > step.id
                                  ? "bg-indigo-600"
                                  : "bg-slate-200"
                              }
                            `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div method={"post"}>
            <input type={"hidden"} name={"title"} value={selectedCategory} />
            <Card
              className={currentStep < 3 ? "cardcontainer" : "descpcontainer"}
            >
              <CardContent className="!p-8">
                {currentStep === 1 && renderCategorySelection()}
                {currentStep === 2 && renderBasicInfo()}
                {currentStep === 3 && renderMediaAndOptions()}
                {currentStep === 4 && renderTextEditor()}

                {/* Footer */}
                <div className="flex items-center justify-between !mt-8 !pt-6 border-t">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {currentStep === 2 && (
                      <>
                        <span>
                          Step {currentStep} of {steps.length}
                        </span>
                        <span>•</span>
                        <span>Auto-saved 30 seconds ago</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Previous Step
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                      onClick={handleNext}
                      disabled={Boolean(currentStep === 1 && !selectedCategory)}
                    >
                      {currentStep === steps.length
                        ? "Create Campaign"
                        : "Next Step"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
