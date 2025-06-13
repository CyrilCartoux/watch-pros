"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  MessageSquare,
  DollarSign,
  User,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NotificationType } from "@/types/db/notifications/Notifications";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { countries } from "@/data/form-options";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  listing?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    status: string;
    listing_images: {
      url: string;
      order_index: number;
    }[];
    brand: {
      id: string;
      slug: string;
      label: string;
    };
    model: {
      id: string;
      slug: string;
      label: string;
    };
  };
  model?: {
    id: string;
    slug: string;
    label: string;
    brand: {
      id: string;
      slug: string;
      label: string;
    };
  };
};

type ListingSubscription = {
  id: string;
  created_at: string;
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    status: string;
    listing_images: {
      url: string;
      order_index: number;
    }[];
    brand: {
      id: string;
      slug: string;
      label: string;
    };
    model: {
      id: string;
      slug: string;
      label: string;
    };
  };
};

type ModelSubscription = CustomAlert;

type Offer = {
  id: string;
  offer: number;
  currency: string;
  created_at: string;
  is_accepted: boolean | null;
  seller: {
    id: string;
    watch_pros_name: string;
    company_name: string;
  };
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    status: string;
    listing_images: {
      url: string;
      order_index: number;
    }[];
  };
};

type CustomAlert = {
  id: string;
  created_at: string;
  brand_id: string | null;
  model_id: string | null;
  reference: string | null;
  max_price: number | null;
  location: string | null;
  brand?: {
    id: string;
    slug: string;
    label: string;
  };
  model?: {
    id: string;
    slug: string;
    label: string;
  };
};

function NotificationSkeleton() {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-3 md:p-4">
        <div className="flex gap-3 md:gap-4">
          <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
                <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ListingSubscriptionSkeleton() {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-3 md:p-4">
        <div className="flex gap-3 md:gap-4">
          <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-md" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-1/3 mt-1" />
            <div className="mt-3 md:mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModelSubscriptionSkeleton() {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-3 md:p-4">
        <div className="flex gap-3 md:gap-4">
          <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-md" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3 mt-1" />
            <div className="mt-3 md:mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OfferSkeleton() {
  return (
    <Card className="border-primary/20">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <Skeleton className="w-full md:w-48 h-48 md:h-32 rounded-md" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("tab") || "offers");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [listingSubscriptions, setListingSubscriptions] = useState<ListingSubscription[]>([]);
  const [modelSubscriptions, setModelSubscriptions] = useState<ModelSubscription[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "listing" | "model";
    id: string;
    name: string;
  } | null>(null);
  const [offerFilter, setOfferFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [loadingOffers, setLoadingOffers] = useState<{ [key: string]: boolean }>({});

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", activeTab);
    router.push(`?${params.toString()}`);
  }, [activeTab, router, searchParams]);

  // Update tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["offers", "active", "history"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    }
  };

  // Fetch listing subscriptions
  const fetchListingSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscribe-listing");
      if (!response.ok)
        throw new Error("Failed to fetch listing subscriptions");
      const data = await response.json();
      setListingSubscriptions(data.subscriptions);
    } catch (err) {
      console.error("Error fetching listing subscriptions:", err);
      setError("Failed to load listing subscriptions");
    }
  };

  // Fetch model subscriptions
  const fetchModelSubscriptions = async () => {
    try {
      const response = await fetch("/api/custom-alerts");
      if (!response.ok) throw new Error("Failed to fetch custom alerts");
      const data = await response.json();
      setModelSubscriptions(data.alerts);
    } catch (err) {
      console.error("Error fetching custom alerts:", err);
      setError("Failed to load custom alerts");
    }
  };

  // Fetch offers
  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers/me");
      if (!response.ok) throw new Error("Failed to fetch offers");
      const data = await response.json();
      setOffers(data.offers);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to load offers");
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchNotifications(),
        fetchListingSubscriptions(),
        fetchModelSubscriptions(),
        fetchOffers(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/read?id=${id}`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to mark notification as read");

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);

      if (unreadIds.length === 0) return;

      const response = await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: unreadIds }),
      });

      if (!response.ok) throw new Error("Failed to mark notifications as read");

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError("Failed to mark all notifications as read");
    }
  };

  const removeNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete notification");

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification");
    }
  };

  const handleDeleteClick = (
    type: "listing" | "model",
    id: string,
    name: string
  ) => {
    setItemToDelete({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint =
        itemToDelete.type === "listing"
          ? "/api/subscribe-listing"
          : "/api/custom-alerts";
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemToDelete.id.toString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to delete subscription");

      if (itemToDelete.type === "listing") {
        setListingSubscriptions((prev) =>
          prev.filter((sub) => sub.listing.id !== itemToDelete.id)
        );
      } else {
        setModelSubscriptions((prev) =>
          prev.filter((sub) => sub.id !== itemToDelete.id)
        );
      }
    } catch (err) {
      console.error("Error deleting subscription:", err);
      setError("Failed to delete subscription");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    try {
      setLoadingOffers(prev => ({ ...prev, [offerId]: true }));
      const response = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (!response.ok) throw new Error(`Failed to ${action} offer`);

      // Update the offer in the local state instead of removing it
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, is_accepted: action === 'accept' }
          : offer
      ));
    } catch (err) {
      console.error(`Error ${action}ing offer:`, err);
      setError(`Failed to ${action} offer`);
    } finally {
      setLoadingOffers(prev => ({ ...prev, [offerId]: false }));
    }
  };

  const filteredOffers = offers.filter(offer => {
    switch (offerFilter) {
      case 'pending':
        return offer.is_accepted === null;
      case 'accepted':
        return offer.is_accepted === true;
      case 'declined':
        return offer.is_accepted === false;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="container py-4 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>

        <Tabs defaultValue="offers" className="space-y-4 md:space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="offers" className="flex-1 sm:flex-none">
              Offers
              {offers.length > 0 && offers.some(o => o.is_accepted === null) && (
                <div className="w-2 h-2 rounded-full bg-destructive ml-2" />
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1 sm:flex-none">
              Active Alerts
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 sm:flex-none">
              History
              {notifications.some((n) => !n.is_read) && (
                <div className="w-2 h-2 rounded-full bg-destructive ml-2" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <OfferSkeleton key={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6 md:space-y-8">
            {/* Listing Alerts */}
            <div>
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3].map((i) => (
                  <ListingSubscriptionSkeleton key={i} />
                ))}
              </div>
            </div>

            {/* Model Alerts */}
            <div>
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3].map((i) => (
                  <ModelSubscriptionSkeleton key={i} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <NotificationSkeleton key={i} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4 md:py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Notification Center</h1>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Link href="/alerts/create">
              <Bell className="h-4 w-4 mr-2" />
              Create Alert
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="offers" className="flex-1 sm:flex-none">
            Offers
            {offers.length > 0 && offers.some(o => o.is_accepted === null) && (
              <div className="w-2 h-2 rounded-full bg-destructive ml-2" />
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1 sm:flex-none">
            Active Alerts
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 sm:flex-none">
            History
            {notifications.some((n) => !n.is_read) && (
              <div className="w-2 h-2 rounded-full bg-destructive ml-2" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <OfferSkeleton key={i} />
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No offers yet</h3>
              <p className="text-muted-foreground">
                You haven't received any offers for your listings.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={offerFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOfferFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={offerFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOfferFilter('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={offerFilter === 'accepted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOfferFilter('accepted')}
                >
                  Accepted
                </Button>
                <Button
                  variant={offerFilter === 'declined' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOfferFilter('declined')}
                >
                  Declined
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredOffers.map((offer) => (
                  <Card
                    key={offer.id}
                    className={`border-primary/20 hover:border-primary/40 transition-colors ${
                      offer.is_accepted === true ? 'border-green-500/50' :
                      offer.is_accepted === false ? 'border-red-500/50' :
                      'border-primary/20'
                    }`}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <Link
                          href={`/listings/${offer.listing?.id}`}
                          className="relative w-full md:w-48 h-48 md:h-32"
                        >
                          <Image
                            src={
                              offer.listing.listing_images[0]?.url ||
                              `/api/listings/${offer.listing.id}/image`
                            }
                            alt={offer.listing.title}
                            fill
                            className="rounded-md object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div>
                                <Link
                                  href={`/listings/${offer.listing.id}`}
                                  className="hover:underline"
                                >
                                  <h3 className="font-medium text-lg">
                                    {offer.listing.title}
                                  </h3>
                                </Link>
                                <Link
                                  href={`/sellers/${offer.seller.watch_pros_name}`}
                                  className="hover:underline"
                                >
                                  <p className="text-sm text-muted-foreground">
                                    Offered by {offer.seller.watch_pros_name}
                                  </p>
                                </Link>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4 text-primary" />
                                  <span className="text-2xl font-bold text-primary">
                                    {offer.offer.toLocaleString()}{" "}
                                    {offer.currency}
                                  </span>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                  {(
                                    (offer.offer / offer.listing.price) *
                                    100
                                  ).toFixed(0)}
                                  % of asking price
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {new Date(offer.created_at).toLocaleString()}
                                </span>
                              </div>
                              {offer.is_accepted !== null && (
                                <Badge
                                  variant={offer.is_accepted ? "success" : "destructive"}
                                  className="mt-2"
                                >
                                  {offer.is_accepted ? "Accepted" : "Declined"}
                                </Badge>
                              )}
                            </div>
                            {offer.is_accepted === null && (
                              <div className="flex flex-col gap-2">
                                <Button 
                                  className="w-full bg-green-600 hover:bg-green-700"
                                  onClick={() => handleOfferAction(offer.id, 'accept')}
                                  disabled={loadingOffers[offer.id]}
                                >
                                  {loadingOffers[offer.id] ? (
                                    <div className="flex items-center justify-center">
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      Accepting...
                                    </div>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Accept Offer
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  onClick={() => handleOfferAction(offer.id, 'decline')}
                                  disabled={loadingOffers[offer.id]}
                                >
                                  {loadingOffers[offer.id] ? (
                                    <div className="flex items-center justify-center">
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      Declining...
                                    </div>
                                  ) : (
                                    <>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Decline Offer
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-6 md:space-y-8">
          {/* All Alerts */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Custom Alerts
            </h2>
            {modelSubscriptions.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No custom alerts</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any custom alerts yet.
                </p>
                <Button asChild>
                  <Link href="/alerts/create">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {modelSubscriptions.map((alert) => (
                  <Card
                    key={alert.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-start gap-3 md:gap-4">
                        <Link
                          href={`/models/${alert.model?.id}`}
                          className="relative w-12 h-12 md:w-14 md:h-14"
                        >
                          <Image
                            src={`/images/brands/${alert.brand?.slug}.png`}
                            alt={alert.brand?.label || "Brand"}
                            fill
                            className="rounded-md object-contain p-1"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-medium text-sm md:text-base">
                                  {alert.model?.label}
                                </h3>
                              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                                {alert.brand?.label}
                              </p>
                              <div className="mt-2 space-y-1">
                                {alert.reference && (
                                  <div className="flex items-center gap-1 text-xs md:text-sm">
                                    <span className="text-muted-foreground">
                                      Reference:
                                    </span>
                                    <span className="font-medium">
                                      {alert.reference}
                                    </span>
                                  </div>
                                )}
                                {alert.max_price && (
                                  <div className="flex items-center gap-1 text-xs md:text-sm">
                                    <span className="text-muted-foreground">
                                      Max price:
                                    </span>
                                    <span className="font-medium">
                                      {alert.max_price.toLocaleString()} EUR
                                    </span>
                                  </div>
                                )}
                                {alert.location && (
                                  <div className="flex items-center gap-1 text-xs md:text-sm">
                                    <span className="text-muted-foreground">
                                      Location:
                                    </span>
                                    <span className="font-medium">
                                      {countries.find(country => country.value === alert.location)?.label}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                handleDeleteClick(
                                  "model",
                                  alert.id,
                                  alert.model?.label || "Alert"
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete alert</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          {/* Listing Alerts */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Listings you follow
            </h2>
            {listingSubscriptions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No followed listings</h3>
                <p className="text-muted-foreground">
                  You haven't followed any listings yet. Browse listings to start following them.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {listingSubscriptions.map((subscription) => (
                  <Card
                    key={subscription.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <CardContent className="p-3 md:p-4">
                      <div className="flex gap-3 md:gap-4">
                        <Link
                          href={`/listings/${subscription.listing.id}`}
                          className="relative w-20 h-20 md:w-24 md:h-24"
                        >
                          <Image
                            src={
                              subscription.listing.listing_images[0]?.url
                            }
                            alt={subscription.listing.title}
                            fill
                            className="rounded-md object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/listings/${subscription.listing.id}`}
                                className="hover:underline block"
                              >
                                <h3 className="font-medium truncate text-sm md:text-base">
                                  {subscription.listing.title}
                                </h3>
                              </Link>
                              <p className="text-base md:text-lg font-bold mt-1">
                                {subscription.listing.price.toLocaleString()}{" "}
                                {subscription.listing.currency}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground hover:text-destructive flex-shrink-0"
                              onClick={() =>
                                handleDeleteClick(
                                  "listing",
                                  subscription.listing.id,
                                  subscription.listing.title
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete subscription</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-3 md:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-xl md:text-2xl font-bold">
              Notification History
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {notifications.filter((n) => !n.is_read).length} unread
              </Badge>
              {notifications.some((n) => !n.is_read) && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full sm:w-auto">
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
              <p className="text-muted-foreground">
                Your notification history will appear here when you receive notifications.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`hover:bg-muted/50 transition-colors ${!notification.is_read ? "border-primary/50" : ""}`}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex gap-3 md:gap-4">
                    <Link
                      href={
                        notification.listing
                          ? `/listings/${notification.listing.id}`
                          : `/models/${notification.model?.id}`
                      }
                      className="relative w-14 h-14 md:w-16 md:h-16"
                    >
                      <Image
                        src={
                          notification.listing
                            ? notification.listing.listing_images?.[0]?.url ||
                              `/api/listings/${notification.listing.id}/image`
                            : `/images/brands/${notification.model?.brand.slug}.png`
                        }
                        alt={notification.title}
                        fill
                        className="rounded-md object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={
                              notification.listing
                                ? `/listings/${notification.listing.id}`
                                : `/models/${notification.model?.id}`
                            }
                            className="hover:underline"
                          >
                            <h3 className="font-medium text-sm md:text-base">
                              {notification.title}
                            </h3>
                          </Link>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 md:h-10 md:w-10"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 md:h-10 md:w-10"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscription? You will no longer receive notifications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
