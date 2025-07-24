"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  Shield,
  Loader2,
  CheckCircle2,
  CreditCard,
  Calendar,
  Share2,
  AlertTriangle,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { countries } from "@/data/form-options";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  seller_id: string | null;
}

interface SellerAccount {
  companyName: string;
  companyLogo: string | null;
  watchProsName: string;
  companyStatus: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  title: string;
  phonePrefix: string;
  phone: string;
  cryptoFriendly: boolean;
}

interface SellerAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  website: string;
  siren: string;
  taxId: string;
  vatNumber: string;
}

interface Seller {
  id: string;
  account: SellerAccount;
  address: SellerAddress | null;
  stats: {
    totalReviews: number;
    averageRating: number;
    lastUpdated: string;
  };
}

interface Subscription {
  status:
    | "active"
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "past_due"
    | "canceled"
    | "unpaid";
  pm_type: "card" | "sepa_debit" | null;
  pm_last4: string | null;
  pm_brand: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  plan: {
    name: string;
    description: string;
    price: {
      early: number;
      regular: number;
    };
    features: string[];
    maxListings: number | null;
    highlighted?: boolean;
  } | null;
}

function SettingsTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Logo and Info Skeleton */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <Skeleton className="w-24 h-24 rounded-lg" />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Address Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40 mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}

export function SettingsTab() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        // Fetch user profile
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        const response = await fetch(`/api/profiles/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const profileData = await response.json();
        setProfile(profileData);

        // If user is a seller, fetch seller data from API
        if (profileData.seller_id) {
          const response = await fetch(`/api/sellers/${profileData.seller_id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch seller data");
          }
          const sellerData = await response.json();
          setSeller(sellerData);
        }

        // Fetch subscription data
        const subscriptionResponse = await fetch("/api/subscriptions");
        if (!subscriptionResponse.ok) {
          throw new Error("Failed to fetch subscription data");
        }
        const subscriptionData = await subscriptionResponse.json();
        if (subscriptionData.error) {
          setSubscriptionError(subscriptionData.error);
        } else {
          setSubscription(subscriptionData.subscription);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getPaymentMethodIcon = (brand: string | null) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      default:
        return "💳";
    }
  };

  const getSubscriptionStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
            Active
          </Badge>
        );
      case "trialing":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
            Trial
          </Badge>
        );
      case "incomplete":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
            Incomplete
          </Badge>
        );
      case "past_due":
        return (
          <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
            Past Due
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleShareProfile = async () => {
    try {
      const shareData = {
        title: "Review my Watch Pros® Profile",
        text: `Please review my profile on Watch Pros®: ${seller?.account.companyName}`,
        url: `${window.location.origin}/sellers/${seller?.account.watchProsName}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied!",
          description: "Share this link with your peers to get reviews.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) return <SettingsTabSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="space-y-6">
      {/* Security Alert */}
      <div className="border-amber-200 bg-amber-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-amber-800">
            <strong>Profile editing is temporarily disabled</strong> for
            security reasons. All fields are displayed in read-only mode. Please
            contact support if you need to update your information.
          </div>
        </div>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Profile
          </CardTitle>
          <CardDescription>
            Your account information (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {seller && (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-background">
                {seller.account.companyLogo ? (
                  <Image
                    src={seller.account.companyLogo}
                    alt={`${seller.account.companyName} logo`}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-3xl font-bold text-primary">
                    {seller.account.companyName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="text-2xl font-bold">
                    {seller.account.companyName}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                  >
                    <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="font-medium">Verified</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {seller.account.companyStatus}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {seller.account.cryptoFriendly && (
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-500 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                    >
                      <Coins className="h-3 w-3 mr-1" />
                      Accepts Crypto
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {getCountryFlag(seller.account.country)}{" "}
                    {
                      countries.find((c) => c.value === seller.account.country)
                        ?.label
                    }
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={handleShareProfile}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Invite peers to review
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={seller?.account.firstName || profile.first_name || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={seller?.account.lastName || profile.last_name || ""}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {seller && (
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={seller.account.companyName}
                disabled
                className="bg-muted"
              />
            </div>
          )}

          {seller && (
            <div className="space-y-2">
              <Label>Watch Pros Name</Label>
              <Input
                value={seller.account.watchProsName}
                disabled
                className="bg-muted"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address */}
      {seller && seller.address && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Address
            </CardTitle>
            <CardDescription>Your company address (read-only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Street</Label>
              <Input
                value={seller.address.street}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={seller.address.postalCode}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={seller.address.city}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                value={
                  countries.find((c) => c.value === seller.address?.country)
                    ?.label ||
                  seller.address?.country ||
                  "Not provided"
                }
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={seller.address.website || "Not provided"}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>SIREN</Label>
                <Input
                  value={seller.address.siren}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>VAT Number</Label>
                <Input
                  value={seller.address.vatNumber}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Tax ID</Label>
                <Input
                  value={seller.address.taxId}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Contact
          </CardTitle>
          <CardDescription>Contact information (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input
              type="email"
              value={seller?.account.email || profile.email || ""}
              disabled
              className="bg-muted"
            />
          </div>
          {seller && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Phone Prefix</Label>
                  <Input
                    value={seller.account.phonePrefix}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={seller.account.phone}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value="••••••••"
              disabled
              className="bg-muted"
            />
            <Button variant="outline" className="mt-2" disabled>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Your subscription and payment information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscriptionError ? (
            <div className="text-center py-6">
              <p className="text-red-500 mb-4">{subscriptionError}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : subscription ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Payment Method</span>
                </div>
                {getSubscriptionStatusBadge(subscription.status)}
              </div>

              {subscription.plan && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {subscription.plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {subscription.plan.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        subscription.plan.highlighted ? "default" : "secondary"
                      }
                    >
                      {subscription.plan.maxListings
                        ? `${subscription.plan.maxListings} listings`
                        : "Unlimited"}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    {subscription.plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Card Type</Label>
                  <div className="flex items-center gap-2">
                    <span>{getPaymentMethodIcon(subscription.pm_brand)}</span>
                    <span className="capitalize">
                      {subscription.pm_brand || "Not set"}
                    </span>
                    {subscription.pm_last4 && (
                      <span className="text-muted-foreground">
                        •••• {subscription.pm_last4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Next Billing Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {subscription.current_period_end
                        ? new Date(
                            subscription.current_period_end
                          ).toLocaleDateString()
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push("/subscription")}
                >
                  Manage Subscription
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                No active subscription found
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Subscribe to access premium features and start selling on our
                platform.
              </p>
              <Button onClick={() => router.push("/subscription")}>
                Subscribe Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getCountryFlag(countryCode: string): string {
  // Convert country code to regional indicator symbols
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
