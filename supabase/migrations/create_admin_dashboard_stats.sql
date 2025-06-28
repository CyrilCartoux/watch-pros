-- Function to get comprehensive admin dashboard statistics
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats(
  period_type text DEFAULT 'all' -- 'week', 'month', 'year', 'all'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  period_start timestamp with time zone;
  period_end timestamp with time zone := now();
  result jsonb;
BEGIN
  -- Set period start based on period_type
  CASE period_type
    WHEN 'week' THEN period_start := now() - interval '7 days';
    WHEN 'month' THEN period_start := now() - interval '1 month';
    WHEN 'year' THEN period_start := now() - interval '1 year';
    ELSE period_start := '1970-01-01'::timestamp with time zone;
  END CASE;

  WITH stats AS (
    -- User statistics (only count users with seller_id)
    SELECT 
      (SELECT COUNT(*) FROM public.profiles WHERE seller_id IS NOT NULL) as total_users,
      (SELECT COUNT(*) FROM public.profiles WHERE seller_id IS NOT NULL AND created_at >= period_start) as new_users_period,
      (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as admin_users,
      (SELECT COUNT(*) FROM public.profiles WHERE role = 'user' AND seller_id IS NOT NULL) as regular_users,
      
      -- Subscription statistics
      (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active') as active_subscriptions,
      (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'incomplete') as incomplete_subscriptions,
      (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'canceled') as canceled_subscriptions,
      (SELECT COUNT(*) FROM public.subscriptions WHERE created_at >= period_start) as new_subscriptions_period,
      
      -- Listing statistics (checking actual status values)
      (SELECT COUNT(*) FROM public.listings) as total_listings,
      (SELECT COUNT(*) FROM public.listings WHERE status IS NULL OR status = 'active') as active_listings,
      (SELECT COUNT(*) FROM public.listings WHERE status = 'sold') as sold_listings,
      (SELECT COUNT(*) FROM public.listings WHERE status = 'hold') as on_hold_listings,
      (SELECT COUNT(*) FROM public.listings WHERE created_at >= period_start) as new_listings_period,
      (SELECT COUNT(*) FROM public.listings WHERE sold_at >= period_start) as sold_listings_period,
      
      -- Message statistics
      (SELECT COUNT(*) FROM public.messages) as total_messages,
      (SELECT COUNT(*) FROM public.messages WHERE created_at >= period_start) as new_messages_period,
      
      -- Custom alerts statistics
      (SELECT COUNT(*) FROM public.custom_alerts) as total_custom_alerts,
      (SELECT COUNT(*) FROM public.custom_alerts WHERE created_at >= period_start) as new_custom_alerts_period,
      (SELECT ROUND(AVG(alerts_per_user)::numeric, 2) FROM (
        SELECT COUNT(*) as alerts_per_user 
        FROM public.custom_alerts 
        GROUP BY user_id
      ) as user_alerts) as avg_alerts_per_user,
      
      -- Favorites statistics
      (SELECT COUNT(*) FROM public.favorites) as total_favorites,
      (SELECT COUNT(*) FROM public.favorites WHERE created_at >= period_start) as new_favorites_period,
      
      -- Newsletter subscribers
      (SELECT COUNT(*) FROM public.newsletter_subscribers WHERE status = 'active') as active_newsletter_subscribers,
      (SELECT COUNT(*) FROM public.newsletter_subscribers WHERE created_at >= period_start) as new_newsletter_subscribers_period,
      
      -- Offers statistics
      (SELECT COUNT(*) FROM public.offers) as total_offers,
      (SELECT COUNT(*) FROM public.offers WHERE is_accepted = true) as accepted_offers,
      (SELECT COUNT(*) FROM public.offers WHERE is_accepted = false) as rejected_offers,
      (SELECT COUNT(*) FROM public.offers WHERE is_accepted IS NULL) as pending_offers,
      (SELECT COUNT(*) FROM public.offers WHERE created_at >= period_start) as new_offers_period,
      
      -- Reviews statistics
      (SELECT COUNT(*) FROM public.seller_reviews) as total_reviews,
      (SELECT COUNT(*) FROM public.seller_reviews WHERE created_at >= period_start) as new_reviews_period,
      (SELECT ROUND(AVG(rating)::numeric, 2) FROM public.seller_reviews) as avg_rating,
      
      -- Pricing statistics
      (SELECT ROUND(AVG(price)::numeric, 2) FROM public.listings WHERE status IS NULL OR status = 'active') as avg_listing_price,
      (SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price)::numeric, 2) FROM public.listings WHERE status IS NULL OR status = 'active') as median_listing_price,
      (SELECT ROUND(SUM(price)::numeric, 2) FROM public.listings WHERE status IS NULL OR status = 'active') as total_gmv,
      
      -- Sales rate
      (SELECT ROUND(
        CASE 
          WHEN COUNT(*) = 0 THEN 0 
          ELSE (COUNT(*) FILTER (WHERE status = 'sold')::numeric / COUNT(*)::numeric) * 100 
        END::numeric, 2
      ) FROM public.listings) as sales_rate_percent,
      
      -- Active searches
      (SELECT COUNT(*) FROM public.active_searches WHERE is_active = true) as active_searches_count,
      (SELECT COUNT(*) FROM public.active_searches WHERE created_at >= period_start) as new_searches_period
  )
  SELECT jsonb_build_object(
    'users', jsonb_build_object(
      'total', total_users,
      'new_period', new_users_period,
      'admins', admin_users,
      'regular', regular_users
    ),
    'subscriptions', jsonb_build_object(
      'active', active_subscriptions,
      'incomplete', incomplete_subscriptions,
      'canceled', canceled_subscriptions,
      'new_period', new_subscriptions_period
    ),
    'listings', jsonb_build_object(
      'total', total_listings,
      'active', active_listings,
      'sold', sold_listings,
      'on_hold', on_hold_listings,
      'new_period', new_listings_period,
      'sold_period', sold_listings_period
    ),
    'messages', jsonb_build_object(
      'total', total_messages,
      'new_period', new_messages_period
    ),
    'custom_alerts', jsonb_build_object(
      'total', total_custom_alerts,
      'new_period', new_custom_alerts_period,
      'avg_per_user', avg_alerts_per_user
    ),
    'favorites', jsonb_build_object(
      'total', total_favorites,
      'new_period', new_favorites_period
    ),
    'newsletter', jsonb_build_object(
      'active_subscribers', active_newsletter_subscribers,
      'new_period', new_newsletter_subscribers_period
    ),
    'offers', jsonb_build_object(
      'total', total_offers,
      'accepted', accepted_offers,
      'rejected', rejected_offers,
      'pending', pending_offers,
      'new_period', new_offers_period
    ),
    'reviews', jsonb_build_object(
      'total', total_reviews,
      'new_period', new_reviews_period,
      'avg_rating', avg_rating
    ),
    'pricing', jsonb_build_object(
      'avg_price', avg_listing_price,
      'median_price', median_listing_price,
      'total_gmv', total_gmv
    ),
    'sales_rate', sales_rate_percent,
    'active_searches', jsonb_build_object(
      'active_count', active_searches_count,
      'new_period', new_searches_period
    )
  ) INTO result FROM stats;
  
  RETURN result;
END;
$$;

-- Function to get top brands and models
CREATE OR REPLACE FUNCTION get_top_brands_models()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  result jsonb;
BEGIN
  WITH brand_stats AS (
    SELECT 
      b.label as brand_name,
      b.slug as brand_slug,
      COUNT(l.id) as listing_count,
      COUNT(l.id) FILTER (WHERE l.status = 'sold') as sold_count,
      ROUND(AVG(l.price), 2) as avg_price,
      ROUND(SUM(l.price), 2) as total_value
    FROM public.brands b
    LEFT JOIN public.listings l ON b.id = l.brand_id
    GROUP BY b.id, b.label, b.slug
    ORDER BY listing_count DESC
    LIMIT 10
  ),
  model_stats AS (
    SELECT 
      m.label as model_name,
      m.slug as model_slug,
      b.label as brand_name,
      COUNT(l.id) as listing_count,
      COUNT(l.id) FILTER (WHERE l.status = 'sold') as sold_count,
      ROUND(AVG(l.price), 2) as avg_price,
      ROUND(SUM(l.price), 2) as total_value
    FROM public.models m
    JOIN public.brands b ON m.brand_id = b.id
    LEFT JOIN public.listings l ON m.id = l.model_id
    GROUP BY m.id, m.label, m.slug, b.label
    ORDER BY listing_count DESC
    LIMIT 10
  )
  SELECT jsonb_build_object(
    'top_brands', (SELECT jsonb_agg(row_to_json(brand_stats)) FROM brand_stats),
    'top_models', (SELECT jsonb_agg(row_to_json(model_stats)) FROM model_stats)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to get time series data for charts
CREATE OR REPLACE FUNCTION get_time_series_data(
  metric text,
  period text DEFAULT 'month' -- 'week', 'month', 'year'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  result jsonb;
  date_format text;
  interval_value text;
  period_interval interval;
BEGIN
  -- Set date format and interval based on period
  CASE period
    WHEN 'week' THEN 
      date_format := 'YYYY-WW';
      period_interval := interval '1 week';
    WHEN 'month' THEN 
      date_format := 'YYYY-MM';
      period_interval := interval '1 month';
    WHEN 'year' THEN 
      date_format := 'YYYY';
      period_interval := interval '1 year';
    ELSE 
      date_format := 'YYYY-MM';
      period_interval := interval '1 month';
  END CASE;

  CASE metric
    WHEN 'listings' THEN
      SELECT jsonb_agg(row_to_json(t)) INTO result
      FROM (
        SELECT 
          to_char(date_trunc(period::text, created_at), date_format) as period,
          COUNT(*) as count,
          COUNT(*) FILTER (WHERE status = 'sold') as sold_count,
          ROUND(AVG(price)::numeric, 2) as avg_price
        FROM public.listings
        WHERE created_at >= now() - make_interval(months => 12)
        GROUP BY date_trunc(period::text, created_at)
        ORDER BY period
      ) t;
      
    WHEN 'users' THEN
      SELECT jsonb_agg(row_to_json(t)) INTO result
      FROM (
        SELECT 
          to_char(date_trunc(period::text, created_at), date_format) as period,
          COUNT(*) as count
        FROM public.profiles
        WHERE seller_id IS NOT NULL AND created_at >= now() - make_interval(months => 12)
        GROUP BY date_trunc(period::text, created_at)
        ORDER BY period
      ) t;
      
    WHEN 'messages' THEN
      SELECT jsonb_agg(row_to_json(t)) INTO result
      FROM (
        SELECT 
          to_char(date_trunc(period::text, created_at), date_format) as period,
          COUNT(*) as count
        FROM public.messages
        WHERE created_at >= now() - make_interval(months => 12)
        GROUP BY date_trunc(period::text, created_at)
        ORDER BY period
      ) t;
      
    WHEN 'custom_alerts' THEN
      SELECT jsonb_agg(row_to_json(t)) INTO result
      FROM (
        SELECT 
          to_char(date_trunc(period::text, created_at), date_format) as period,
          COUNT(*) as count
        FROM public.custom_alerts
        WHERE created_at >= now() - make_interval(months => 12)
        GROUP BY date_trunc(period::text, created_at)
        ORDER BY period
      ) t;
      
    WHEN 'favorites' THEN
      SELECT jsonb_agg(row_to_json(t)) INTO result
      FROM (
        SELECT 
          to_char(date_trunc(period::text, created_at), date_format) as period,
          COUNT(*) as count
        FROM public.favorites
        WHERE created_at >= now() - make_interval(months => 12)
        GROUP BY date_trunc(period::text, created_at)
        ORDER BY period
      ) t;
      
    WHEN 'newsletter' THEN
      SELECT jsonb_agg(row_to_json(t)) INTO result
      FROM (
        SELECT 
          to_char(date_trunc(period::text, created_at), date_format) as period,
          COUNT(*) as count
        FROM public.newsletter_subscribers
        WHERE created_at >= now() - make_interval(months => 12)
        GROUP BY date_trunc(period::text, created_at)
        ORDER BY period
      ) t;
      
    WHEN 'reviews' THEN
      SELECT jsonb_agg(row_to_json(t)) INTO result
      FROM (
        SELECT 
          to_char(date_trunc(period::text, created_at), date_format) as period,
          COUNT(*) as count,
          ROUND(AVG(rating)::numeric, 2) as avg_rating
        FROM public.seller_reviews
        WHERE created_at >= now() - make_interval(months => 12)
        GROUP BY date_trunc(period::text, created_at)
        ORDER BY period
      ) t;
      
    WHEN 'offers' THEN
      SELECT jsonb_agg(row_to_json(t)) INTO result
      FROM (
        SELECT 
          to_char(date_trunc(period::text, created_at), date_format) as period,
          COUNT(*) as count,
          COUNT(*) FILTER (WHERE is_accepted = true) as accepted_count,
          COUNT(*) FILTER (WHERE is_accepted = false) as rejected_count
        FROM public.offers
        WHERE created_at >= now() - make_interval(months => 12)
        GROUP BY date_trunc(period::text, created_at)
        ORDER BY period
      ) t;
      
    ELSE
      result := '[]'::jsonb;
  END CASE;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Function to get newsletter subscribers list
CREATE OR REPLACE FUNCTION get_newsletter_subscribers(
  limit_count int DEFAULT 100,
  offset_count int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'subscribers', (
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT 
          id,
          email,
          status,
          created_at,
          updated_at
        FROM public.newsletter_subscribers
        ORDER BY created_at DESC
        LIMIT limit_count
        OFFSET offset_count
      ) t
    ),
    'total_count', (SELECT COUNT(*) FROM public.newsletter_subscribers)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_brands_models() TO authenticated;
GRANT EXECUTE ON FUNCTION get_time_series_data(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_newsletter_subscribers(int, int) TO authenticated; 