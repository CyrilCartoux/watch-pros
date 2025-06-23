-- Drop the old function first to avoid overloading conflicts
DROP FUNCTION IF EXISTS public.rpc_search_listings(
  text, text, text, text, text, text, text, text, text, numeric, numeric, text, text, integer
);

-- Create the new function with accessory_type parameter
CREATE OR REPLACE FUNCTION public.rpc_search_listings(
  _search      text,
  _brand_slug  text    DEFAULT NULL,
  _model_slug  text    DEFAULT NULL,
  _ref         text    DEFAULT NULL,
  _cond        text    DEFAULT NULL,
  _dial_color  text    DEFAULT NULL,
  _country     text    DEFAULT NULL,
  _year        text    DEFAULT NULL,
  _included    text    DEFAULT NULL,
  _min_price   numeric DEFAULT NULL,
  _max_price   numeric DEFAULT NULL,
  _shipping    text    DEFAULT NULL,
  _listing_type  text    DEFAULT NULL,
  _accessory_type text  DEFAULT NULL,
  _limit       int     DEFAULT 20
)
RETURNS TABLE (
  id             uuid,
  reference_id   text,
  seller_id      uuid,
  brand_id       uuid,
  model_id       uuid,
  reference      varchar,
  title          varchar,
  description    text,
  year           varchar,
  dial_color     varchar,
  included       varchar,
  condition      varchar,
  price          numeric,
  currency       varchar,
  shipping_delay varchar,
  status         varchar,
  created_at     timestamptz,
  updated_at     timestamptz,
  listing_type   text,
  accessory_type varchar,
  final_price    numeric,
  brand_label    text,
  brand_slug     text,
  model_label    text,
  model_slug     text,
  country        varchar,
  sold_at        timestamptz,
  fts            tsvector,
  listing_images jsonb,
  seller         jsonb,
  full_count     bigint
)
LANGUAGE sql AS $$
WITH qs AS (
  SELECT
    CASE WHEN trim(_search) <> ''
         THEN websearch_to_tsquery('english', _search)
    END AS q
),
filtered AS (
  SELECT
    l.*,  -- inclut déjà fts
    -- ranking full-text (NULL si pas de recherche)
    CASE WHEN qs.q IS NOT NULL THEN ts_rank_cd(l.fts, qs.q) ELSE NULL END AS rank,
    -- total avant pagination
    COUNT(*) OVER() AS full_count
  FROM public.listings l
  CROSS JOIN qs
  WHERE
    (qs.q        IS NULL OR l.fts @@ qs.q)
    AND (_brand_slug IS NULL OR l.brand_slug    = _brand_slug)
    AND (_model_slug IS NULL OR l.model_slug    = _model_slug)
    AND (_ref        IS NULL OR l.reference ILIKE '%' || _ref || '%')
    AND (_cond       IS NULL OR l.condition     = _cond)
    AND (_dial_color IS NULL OR l.dial_color    = _dial_color)
    AND (_country    IS NULL OR l.country       = _country)
    AND (_year       IS NULL OR l.year          = _year)
    AND (_included   IS NULL OR l.included      = _included)
    AND (_min_price  IS NULL OR l.price         >= _min_price)
    AND (_max_price  IS NULL OR l.price         <= _max_price)
    AND (_shipping   IS NULL OR l.shipping_delay = _shipping)
    AND (_listing_type IS NULL OR l.listing_type = _listing_type)
    AND (_accessory_type IS NULL OR l.accessory_type = _accessory_type)
        AND l.status IN ('active', 'hold')

)
SELECT
  -- toutes les colonnes de filtered (alias f)
  f.id,
  f.reference_id,
  f.seller_id,
  f.brand_id,
  f.model_id,
  f.reference,
  f.title,
  f.description,
  f.year,
  f.dial_color,
  f.included,
  f.condition,
  f.price,
  f.currency,
  f.shipping_delay,
  f.status,
  f.created_at,
  f.updated_at,
  f.listing_type,
  f.accessory_type,
  f.final_price,
  f.brand_label,
  f.brand_slug,
  f.model_label,
  f.model_slug,
  f.country,
  f.sold_at,
  f.fts,    -- plus d'ambiguïté, il n'y a qu'une seule fts

  -- agrégation des images
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id',          li.id,
        'url',         li.url,
        'order_index', li.order_index
      ) ORDER BY li.order_index
    )
    FROM public.listing_images li
    WHERE li.listing_id = f.id
  ) AS listing_images,

  -- données complètes du seller
  to_jsonb(s) AS seller,

  -- count total
  f.full_count

FROM filtered f
LEFT JOIN public.sellers s ON s.id = f.seller_id

ORDER BY
  -- on trie d'abord par rank (NULLS LAST), puis date
  f.rank DESC NULLS LAST,
  f.created_at DESC

LIMIT _limit;
$$; 