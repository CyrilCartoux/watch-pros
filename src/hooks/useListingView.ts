import { useEffect, useRef } from "react";

export function useListingView(listingId: string | undefined) {
  const hasViewed = useRef(false);

  useEffect(() => {
    if (!listingId || hasViewed.current) return;
    hasViewed.current = true;

    fetch(`/api/listings/${listingId}/view`, {
      method: "POST",
    }).catch(() => {});
  }, [listingId]);
} 