import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Mail, User, AtSign, Edit } from "lucide-react";
import { Button } from "~/components/ui/button";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authCookie, verifyuser } from "~/utils/cookies.server";
import { userProfile } from "~/types/campaign";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  // const API_URL = process.env.API_URL;
  const cookieHeader = request.headers.get("Cookie");
  const token = await authCookie.parse(cookieHeader);

  const data = await verifyuser(token);
  if (!token || data == null) {
    return redirect("/auth");
  }
  console.log(data);
  return json({ data });
}
export default function Component() {
  const { data } = useLoaderData<typeof loader>();
  // Sample user data - in a real app this would come from your database/API
  const user = {
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    username: data?.username,
    avatar: data?.avatar,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={
                    user.avatar ||
                    "https://imagehandler.fra1.digitaloceanspaces.com/defautuser.jpg"
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              @{user.username}
            </CardDescription>
            <div className="flex justify-center gap-2 mt-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Verified
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    First Name
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {user.firstName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Last Name</p>
                  <p className="text-base font-semibold text-gray-900">
                    {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <AtSign className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-base font-semibold text-gray-900">
                    @{user.username}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center text-sm text-gray-500">
              Profile last updated on{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
