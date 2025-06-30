import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Users, Mail, Phone } from "lucide-react";
import { TokenPayload } from "~/types/Token";
import { Form, useFetcher } from "@remix-run/react";

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle: string;
  user: TokenPayload;
}

export function VolunteerModal({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
  user,
}: VolunteerModalProps) {
  const [formData, setFormData] = useState({
    id: campaignId,
    name: user?.sub ?? "",
    email: user?.email ?? "",
    phone: "",
    skills: "",
    availability: "",
    experience: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetcher = useFetcher();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("intent", "volunteer");
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Simulate API call
    fetcher.submit(form, {
      method: "post",
      action: `/campaign/${campaignId}`,
    });

    // Here you would save the volunteer application to your database

    setIsSubmitting(false);
    onClose();
  };

  const isFormValid = formData.name && formData.email && agreedToTerms;

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Volunteer Application</span>
            </DialogTitle>
            <DialogDescription>
              Join the team for {campaignTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Skills and Experience */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Expertise</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="What skills can you contribute? (e.g., marketing, fundraising, event planning, technical skills)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) =>
                    handleInputChange("availability", e.target.value)
                  }
                  placeholder="When are you available to volunteer? (days, times, frequency)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Previous Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  placeholder="Any relevant volunteer or professional experience?"
                  rows={3}
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the volunteer terms and conditions and understand
                that my information will be shared with the campaign organizer.
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
