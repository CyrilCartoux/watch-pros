import { createClient } from '@supabase/supabase-js';
import { models } from '@/data/models';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all brands first
    const { data: brandsData, error: brandsError } = await supabase
      .from('brands')
      .select('id, slug');

    if (brandsError) {
      return NextResponse.json(
        { error: 'Error fetching brands', details: brandsError },
        { status: 500 }
      );
    }

    // Create a map of brand slugs to IDs
    const brandMap = new Map(brandsData.map(brand => [brand.slug, brand.id]));

    // Prepare models data
    const modelsToInsert = Object.entries(models).flatMap(([brandSlug, brandModels]) => {
      const brandId = brandMap.get(brandSlug);
      if (!brandId) {
        console.warn(`Brand not found for slug: ${brandSlug}`);
        return [];
      }
      return brandModels.map(model => ({
        brand_id: brandId,
        slug: model.model_slug,
        label: model.model_label,
        popular: ["rolex", "audemars-piguet","patek-philippe"].includes(model.brand_slug)
      }));
    });

    // Insert models in batches of 100
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < modelsToInsert.length; i += batchSize) {
      const batch = modelsToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('models')
        .insert(batch);

      if (error) {
        results.push({
          batch: i / batchSize + 1,
          status: 'error',
          error
        });
      } else {
        results.push({
          batch: i / batchSize + 1,
          status: 'success',
          count: batch.length
        });
      }
    }

    return NextResponse.json({
      message: 'Models population completed',
      totalModels: modelsToInsert.length,
      results
    });

  } catch (error) {
    console.error('Error populating models:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 