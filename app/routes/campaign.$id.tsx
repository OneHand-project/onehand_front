import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CalendarDays, MapPin, Users, Heart, Share2, Flag } from "lucide-react";
import { DonationModal } from "~/components/donation";
import { VolunteerModal } from "~/components/volunteer";

import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";

import { authCookie } from "~/utils/cookies.server";
import { Campaign } from "~/types/campaign";
import { TokenPayload } from "~/types/Token";
import { jwtDecode } from "jwt-decode";

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await authCookie.parse(cookieHeader);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const API_URL = "http://134.122.95.126:8080";
  if (intent == "donate") {
    try {
      const res = await fetch(`${API_URL}/api/campaigns/donate`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) return json({ message: "donation failed", status: 404 });
    } catch (e) {
      console.error(e);
      return null;
    }
  } else if (intent == "volunteer") {
    try {
      const res = await fetch(`${API_URL}/api/campaigns/volunteer`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) return json({ message: "volunteer failed", status: 404 });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  return json({ message: "donation succesfull" });
}
export async function loader({ params, request }: LoaderFunctionArgs) {
  const API_URL = "http://134.122.95.126:8080";
  const campaignId = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const token = await authCookie.parse(cookieHeader);

  try {
    const res = await fetch(
      `${API_URL}/api/campaigns/getcampaign/${campaignId}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) return redirect("/404");

    const data = await res.json();

    return json({ data, token });
  } catch (e) {
    console.error(e);
    return null;
  }
  console.log("something wen't worng");
  return null;
}
export default function CampaignPage() {
  const { data, token } = useLoaderData<typeof loader>();
  const campaignData: Campaign = data;
  let user: TokenPayload | null = null;

  if (token) {
    try {
      user = jwtDecode<TokenPayload>(token);
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const progressPercentage =
    (campaignData.currentDonation / campaignData.donationGoal) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={
                      campaignData.mainimage ||
                      "https://imagehandler.fra1.digitaloceanspaces.com/defautuser.jpg"
                    }
                    alt="Campaign"
                    className="w-full h-[400px] object-cover rounded-t-lg"
                  />
                  {/* {campaignData.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {campaignData.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )} */}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary">{campaignData.category}</Badge>
                    <CardTitle className="text-2xl">
                      {campaignData.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {campaignData.shortDescription}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{campaignData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{campaignData.daysLeft} days left</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="donors">Supporters</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      {hydrated ? (
                        <p
                          className="whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: campaignData.description,
                          }}
                        ></p>
                      ) : (
                        <p className="prose"></p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                {/* {campaignData.updates.map((update) => (
                  <Card key={update.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                      <CardDescription>{update.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{update.content}</p>
                    </CardContent>
                  </Card>
                ))} */}
              </TabsContent>

              <TabsContent value="donors" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4" />
                      <p>
                        Donor information is kept private to protect supporter
                        privacy.
                      </p>
                      <p className="mt-2">
                        Thank you to all {campaignData.donatercount} supporters!{" "}
                        {/*{campaignData.donorCount}*/}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  raised of $
                  {campaignData.currentDonation?.toLocaleString() ?? "0"}
                </CardTitle>
                <CardDescription>
                  ${campaignData.donationGoal?.toLocaleString() ?? "0"} goal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressPercentage} className="h-3" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">
                      {campaignData.donatercount}
                    </div>
                    <div className="text-muted-foreground">donors</div>
                  </div>
                  <div>
                    <div className="font-semibold">{campaignData.daysLeft}</div>
                    <div className="text-muted-foreground">days left</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowDonationModal(true)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                  </Button>

                  {campaignData.isvolunteer == true ? (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setShowVolunteerModal(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Volunteer ({campaignData.volunteers})
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={
                        campaignData.userProfile.avatar ||
                        "https://imagehandler.fra1.digitaloceanspaces.com/defautuser.jpg"
                      }
                    />
                    <AvatarFallback>CW</AvatarFallback>
                  </Avatar>
                  <div>
                    {campaignData.userProfile && (
                      <div className="font-semibold flex items-center space-x-1">
                        <span>{campaignData.userProfile.username}</span>
                        {campaignData.userProfile.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      Campaign Organizer
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        campaignId={campaignData.id}
        campaignTitle={campaignData.title}
      />

      <VolunteerModal
        isOpen={showVolunteerModal}
        onClose={() => setShowVolunteerModal(false)}
        campaignId={campaignData.id}
        campaignTitle={campaignData.title}
        user={user}
      />
    </div>
  );
}
