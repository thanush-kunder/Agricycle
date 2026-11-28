import { Listing, ReferencePrice } from '../models/index.js';
import { memoryStore } from './memoryStore.js';
import { isDBConnected } from '../config/db.js';
import https from 'https';

/**
 * AgriCycle Platform Knowledge & Government Agricultural Schemes Knowledge Base
 */

export const GOVERNMENT_AGRI_SCHEMES = [
  {
    name: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
    nodalMinistry: 'Ministry of New and Renewable Energy (MNRE), Govt. of India',
    components: [
      'Component A: 10,000 MW of Decentralized Ground-mounted Grid-connected Solar / Renewable energy power plants on rural/agricultural lands.',
      'Component B: Installation of standalone solar agriculture pumps with up to 60% capital subsidy (30% Central + 30% State).',
      'Component C: Solarisation of grid-connected agriculture pumps and feeder-level solarisation.'
    ],
    applicationUrl: 'https://pmkusum.mnre.gov.in',
    relevance: 'Biomass and solar power integration for farmers and farmer producer organizations (FPOs).'
  },
  {
    name: 'SMAM (Sub-Mission on Agricultural Mechanization) - Crop Residue Machinery Subsidy',
    nodalMinistry: 'Ministry of Agriculture & Farmers Welfare, Govt. of India',
    components: [
      'Provides 50% to 80% subsidy for crop residue management machinery (Super Straw Management System - Super SMS, Happy Seeder, Straw Balers, Paddy Straw Choppers, Rakes, Mulchers).',
      'Establishment of Custom Hiring Centres (CHCs) for crop residue management machinery with 80% project financial assistance.'
    ],
    applicationUrl: 'https://agrimachinery.nic.in',
    relevance: 'Enables farmers to harvest and bale straw without burning.'
  },
  {
    name: 'SATAT (Sustainable Alternative Towards Affordable Transportation)',
    nodalMinistry: 'Ministry of Petroleum and Natural Gas (MoPNG), Govt. of India',
    components: [
      'Incentivizes commercial production of Compressed Bio-Gas (CBG) from crop residues (paddy straw, bagasse), cattle dung, and municipal organic waste.',
      'Guaranteed offtake agreement by public oil marketing companies (IOCL, HPCL, BPCL) with indexed procurement pricing.',
      'Encourages Bio-CNG plants and Fermented Organic Manure (FOM) co-production.'
    ],
    applicationUrl: 'https://satat.co.in',
    relevance: 'Transforms agricultural crop residues into transport fuel and organic bio-fertilizer.'
  },
  {
    name: 'PM-PRANAM (Promotion of Alternate Nutrients for Agriculture Management Yojana)',
    nodalMinistry: 'Department of Fertilizers, Govt. of India',
    components: [
      'Provides grants to states to encourage balanced chemical fertilizer use and adoption of natural farming, compost, and bio-fertilizers derived from agricultural biomass.'
    ],
    applicationUrl: 'https://fert.nic.in',
    relevance: 'Direct promotion of compost, vermicompost, and organic residue recycling.'
  },
  {
    name: 'Karnataka Krishi Yantra Dhare (Custom Hiring Service Centres)',
    nodalMinistry: 'Department of Agriculture, Govt. of Karnataka',
    components: [
      'CHCs established across hoblis and taluks in Karnataka (Mandya, Udupi, Mysuru, Shivamogga, Belagavi, etc.) providing affordable hourly rental rates for tractors, balers, rotavators, and harvesters.',
      'Helps small and marginal farmers harvest and manage crop residue economically.'
    ],
    applicationUrl: 'https://raitamitra.karnataka.gov.in',
    relevance: 'Karnataka state-specific agricultural machinery rental and residue handling.'
  }
];

/**
 * Searches Wikipedia API for real-time encyclopedia facts
 */
export async function searchWikipedia(query) {
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&format=json`;

    const req = https.get(url, { headers: { 'User-Agent': 'AgriCycleBot/2.0 (contact@agricycle.in)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const results = json.query?.search || [];
          if (results.length > 0) {
            const top = results.slice(0, 2).map(r => ({
              title: r.title,
              snippet: r.snippet.replace(/<[^>]+>/g, '').trim(),
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/\s+/g, '_'))}`
            }));
            resolve(top);
          } else {
            resolve([]);
          }
        } catch (_) {
          resolve([]);
        }
      });
    });

    req.on('error', () => resolve([]));
    req.setTimeout(4000, () => {
      req.destroy();
      resolve([]);
    });
  });
}

/**
 * Live platform data retriever:
 * Returns real listings and benchmark reference prices from database or memoryStore
 */
export async function getLivePlatformContext(message) {
  const lower = (message || '').toLowerCase();
  const contextSections = [];

  const needsListings = lower.includes('listing') || lower.includes('available') || lower.includes('buy') ||
    lower.includes('waste') || lower.includes('straw') || lower.includes('husk') ||
    lower.includes('bagasse') || lower.includes('market') || lower.includes('near') ||
    lower.includes('mandya') || lower.includes('udupi') || lower.includes('karnataka');

  if (needsListings) {
    try {
      let listings = [];
      if (isDBConnected()) {
        listings = await Listing.find({ status: 'available' }).limit(6).lean();
      }
      if (!listings || listings.length === 0) {
        listings = (memoryStore.listings || []).filter(l => l.status === 'available').slice(0, 6);
      }

      if (listings && listings.length > 0) {
        const formattedList = listings.map(l =>
          `• **${l.title}** (${l.wasteType}): ${l.availableQuantityKg || l.quantityKg} kg | Price: ${l.isFree ? 'Free Giveaway' : '₹' + l.pricePerKg + '/kg'} | Quality: ${l.qualityGrade || 'Grade A'} | Location: ${l.location?.address || 'Karnataka'} | Generator: ${l.generator?.name || 'Verified Farmer'}`
        ).join('\n');

        contextSections.push(
          `[LIVE AGRICYCLE MARKETPLACE INVENTORY]:\n${formattedList}\n*(Tell the user these are real listings currently available on the AgriCycle marketplace that they can browse on browse.html)*`
        );
      }
    } catch (_) {}
  }

  const needsPricing = lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('value') || lower.includes('benchmark');
  if (needsPricing) {
    try {
      let catalog = [];
      if (isDBConnected()) {
        catalog = await ReferencePrice.find({ isActive: true }).lean();
      }
      if (!catalog || catalog.length === 0) {
        catalog = [
          { wasteType: 'Paddy Straw', minPrice: 1.2, maxPrice: 2.0, averagePrice: 1.5, unit: 'kg' },
          { wasteType: 'Wheat Straw', minPrice: 1.0, maxPrice: 1.8, averagePrice: 1.4, unit: 'kg' },
          { wasteType: 'Sugarcane Bagasse', minPrice: 1.8, maxPrice: 2.8, averagePrice: 2.2, unit: 'kg' },
          { wasteType: 'Coconut Husk', minPrice: 0.8, maxPrice: 1.5, averagePrice: 1.1, unit: 'kg' },
          { wasteType: 'Groundnut Shells', minPrice: 2.0, maxPrice: 3.2, averagePrice: 2.6, unit: 'kg' },
          { wasteType: 'Corn Stalks', minPrice: 0.9, maxPrice: 1.6, averagePrice: 1.2, unit: 'kg' }
        ];
      }

      const formattedPrices = catalog.map(p =>
        `• **${p.wasteType}**: ₹${p.minPrice.toFixed(2)} - ₹${p.maxPrice.toFixed(2)} / ${p.unit || 'kg'} (Fair Market Benchmark: ₹${p.averagePrice.toFixed(2)}/${p.unit || 'kg'})`
      ).join('\n');

      contextSections.push(
        `[OFFICIAL AGRICYCLE BENCHMARK PRICING INDEX]:\n${formattedPrices}\n*(Cite these benchmark rates as official AgriCycle market ranges)*`
      );
    } catch (_) {}
  }

  // Check for government schemes / subsidies / legal regulations
  const needsGovtSchemes = lower.includes('scheme') || lower.includes('subsidy') || lower.includes('subsidies') ||
    lower.includes('government') || lower.includes('yojana') || lower.includes('kusum') || lower.includes('smam') ||
    lower.includes('satat') || lower.includes('pranam') || lower.includes('stubble burning') || lower.includes('fine') || lower.includes('law');

  if (needsGovtSchemes) {
    const schemeSummaries = GOVERNMENT_AGRI_SCHEMES.map(s =>
      `• **${s.name}** (${s.nodalMinistry}):\n  - ${s.components.join('\n  - ')}\n  - Official portal: ${s.applicationUrl}`
    ).join('\n\n');

    contextSections.push(
      `[VERIFIED GOVERNMENT AGRICULTURAL SCHEMES & SUBSIDIES (INDIA / KARNATAKA)]:\n${schemeSummaries}\n*(Cite these government programs accurately with their respective ministries and official links)*`
    );
  }

  return contextSections.join('\n\n');
}

export default {
  GOVERNMENT_AGRI_SCHEMES,
  searchWikipedia,
  getLivePlatformContext
};
