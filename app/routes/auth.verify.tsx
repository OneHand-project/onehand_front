import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Label } from "~/components/ui/label";
import { authCookie } from "~/utils/cookies.server";

const emailSentCache = new Map<string, number>();
const CACHE_DURATION = 60000; // 1 minute

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  const cookieHeader = request.headers.get("Cookie");
  const token = await authCookie.parse(cookieHeader);

  if (!email) {
    return json({
      emailSent: false,
      error: null,
      email: email || null,
    });
  }

  // Check cache to prevent duplicate sends
  const cacheKey = email;
  const lastSent = emailSentCache.get(cacheKey);
  const now = Date.now();

  if (lastSent && now - lastSent < CACHE_DURATION) {
    return json({
      emailSent: true,
      error: null,
      email,
      message: "Verification code already sent recently",
    });
  }

  const API_URL = process.env.API_URL;

  try {
    const res = await fetch(`${API_URL}/api/auth/send-email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      console.error("Failed to send email", res.status);
      return json({
        emailSent: false,
        error: "Failed to send verification email",
        email,
      });
    }
    // Cache the send time
    emailSentCache.set(cacheKey, now);

    return json({
      emailSent: true,
      error: null,
      email,
      message: "Verification code sent successfully",
    });
  } catch (e) {
    console.error("Error in loader:", e);
    return json({
      emailSent: false,
      error: "Failed to send verification email",
      email,
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const API_URL = process.env.REACT_APP_API_URL;
  const code = formData.get("code");
  const email = formData.get("email");
  const actionType = formData.get("_action");

  const cookieHeader = request.headers.get("Cookie");
  const token = await authCookie.parse(cookieHeader);

  // Handle resend action
  if (actionType === "resend") {
    if (!email) {
      return json(
        { error: "Email is required for resending" },
        { status: 400 }
      );
    }

    try {
      const res = await fetch(`${API_URL}/users/send-email`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        return json(
          { error: "Failed to resend verification code" },
          { status: 400 }
        );
      }

      // Update cache
      emailSentCache.set(email as string, Date.now());

      return json({ success: "Verification code resent successfully" });
    } catch (e) {
      console.error("Resend error:", e);
      return json(
        { error: "Failed to resend verification code" },
        { status: 500 }
      );
    }
  }

  // Handle verify action
  if (!code || !email) {
    return json({ error: "Missing code or email" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-code`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: email, code: code }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return json(
        { error: errorData.message || "Invalid verification code" },
        { status: 400 }
      );
    }

    // const result = await res.json();

    // Clear cache on successful verification
    emailSentCache.delete(email as string);

    // Redirect on successful verification
    return redirect("/");
  } catch (e) {
    console.error("Verification error:", e);
    return json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}

export default function Verify() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const [code, setCode] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const isLoading = navigation.state === "submitting";

  const showSuccessMessage =
    actionData?.success || (loaderData.emailSent && loaderData?.message);

  const isResending =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "resend";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
      <Card className="w-full max-w-md shadow-2xl border-0 p-4">
        <CardHeader className="text-center space-y-4 pb-8 flex items-center justify-center flex-col p-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {email ? (
                <>
                  We&apos;ve sent a 6-digit verification code to{" "}
                  <span className="font-medium">{email}</span>. Please enter it
                  below to continue.
                </>
              ) : (
                "Please enter the 6-digit verification code sent to your email."
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Verification Form */}
          <Form method="post" className="space-y-4">
            <input type="hidden" name="code" value={code} />
            <input type="hidden" name="email" value={email || ""} />

            <div className="text-center">
              <Label className="text-sm font-medium text-gray-700 block mb-3">
                Enter verification code
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      index={0}
                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
              <div className="text-center text-green-600 text-sm bg-green-50 p-3 rounded-md">
                {actionData?.success || loaderData.message}
              </div>
            )}

            {/* Error Message */}
            {(actionData?.error || loaderData.error) && (
              <div className="text-center text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {actionData?.error || loaderData.error}
              </div>
            )}

            <Button
              type="submit"
              disabled={code.length !== 6 || (isLoading && !isResending)}
              className="w-full mt-14 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading && !isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </Form>

          {/* Resend Form */}
          <div className="text-center space-y-4 mt-8">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the code?
            </p>
            <Form method="post">
              <input type="hidden" name="email" value={email || ""} />
              <input type="hidden" name="_action" value="resend" />
              <Button
                type="submit"
                variant="ghost"
                disabled={isResending || !email}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </Button>
            </Form>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
