import type { Category } from '$lib/types';
import { categoryImage } from './assets';

/**
 * Category tree. Pages, navigation, filters and breadcrumbs are all generated from
 * this list — add a category here and it appears everywhere. Replace with a
 * Categories API response later.
 */
const categoryData: Category[] = [
	{
		slug: 'food-grocery',
		name: 'Food & Grocery',
		shortName: 'Food',
		description: 'Rice, flour, sugar, cooking oil, pasta, canned goods, snacks and pantry staples in bulk packs.',
		icon: 'shopping-basket',
		coverProduct: 'long-grain-rice-25kg',
		subcategories: [
			{ slug: 'rice-grains', name: 'Rice & Grains' },
			{ slug: 'flour-baking', name: 'Flour & Baking' },
			{ slug: 'sugar-salt', name: 'Sugar & Salt' },
			{ slug: 'cooking-oil', name: 'Cooking Oil' },
			{ slug: 'pasta-cereals', name: 'Pasta & Cereals' },
			{ slug: 'canned-goods', name: 'Canned & Sauces' },
			{ slug: 'snacks-confectionery', name: 'Snacks & Confectionery' },
			{ slug: 'spices-seasoning', name: 'Spices & Seasoning' }
		]
	},
	{
		slug: 'beverages',
		name: 'Beverages',
		shortName: 'Drinks',
		description: 'Tea, coffee, bottled water, soft drinks, juice, energy drinks and powdered beverages.',
		icon: 'coffee',
		coverProduct: 'black-tea-500g',
		subcategories: [
			{ slug: 'tea-coffee', name: 'Tea & Coffee' },
			{ slug: 'water', name: 'Bottled Water' },
			{ slug: 'soft-drinks', name: 'Soft Drinks & Juice' },
			{ slug: 'energy-drinks', name: 'Energy Drinks' },
			{ slug: 'powdered', name: 'Powdered Beverages' }
		]
	},
	{
		slug: 'cleaning-household',
		name: 'Cleaning & Household',
		shortName: 'Cleaning',
		description: 'Detergents, dishwashing liquid, soaps, paper products, bin liners and cleaning tools.',
		icon: 'sparkles',
		coverProduct: 'laundry-detergent-5kg',
		subcategories: [
			{ slug: 'laundry', name: 'Laundry' },
			{ slug: 'dishwashing', name: 'Dishwashing' },
			{ slug: 'surface-cleaners', name: 'Surface & Toilet Cleaners' },
			{ slug: 'paper-products', name: 'Paper Products' },
			{ slug: 'bags-liners', name: 'Bin Bags & Liners' },
			{ slug: 'cleaning-tools', name: 'Sponges, Mops & Brooms' }
		]
	},
	{
		slug: 'personal-care',
		name: 'Personal Care',
		shortName: 'Personal care',
		description: 'Bath soap, shampoo, toothpaste, deodorant, lotion, sanitary and baby care products.',
		icon: 'smile',
		coverProduct: 'bath-soap-bar-pack',
		subcategories: [
			{ slug: 'bath-body', name: 'Bath & Body' },
			{ slug: 'hair-care', name: 'Hair Care' },
			{ slug: 'oral-care', name: 'Oral Care' },
			{ slug: 'hygiene', name: 'Hygiene & Sanitary' },
			{ slug: 'baby-care', name: 'Baby Care' }
		]
	},
	{
		slug: 'packaging-food-service',
		name: 'Packaging & Food Service',
		shortName: 'Packaging',
		description: 'Paper bags, takeaway containers, disposable cups and cutlery, foil, cling film and cartons.',
		icon: 'utensils',
		coverProduct: 'kraft-paper-bags',
		subcategories: [
			{ slug: 'bags', name: 'Paper & Plastic Bags' },
			{ slug: 'takeaway', name: 'Takeaway Containers' },
			{ slug: 'disposables', name: 'Cups, Plates & Cutlery' },
			{ slug: 'wraps', name: 'Foil & Cling Film' },
			{ slug: 'shipping', name: 'Tape & Cartons' }
		]
	},
	{
		slug: 'stationery-office',
		name: 'Stationery & Office',
		shortName: 'Stationery',
		description: 'Notebooks, pens, paper, envelopes, files, staplers and school supplies by the box.',
		icon: 'book-open',
		coverProduct: 'exercise-books-96pg',
		subcategories: [
			{ slug: 'paper-notebooks', name: 'Paper & Notebooks' },
			{ slug: 'writing', name: 'Pens, Pencils & Markers' },
			{ slug: 'filing', name: 'Files & Envelopes' },
			{ slug: 'office-tools', name: 'Staplers & Office Tools' }
		]
	},
	{
		slug: 'hardware-supplies',
		name: 'Hardware & General Supplies',
		shortName: 'Hardware',
		description: 'Batteries, extension cables, bulbs, tape, rope, hand tools, safety gear and storage.',
		icon: 'wrench',
		coverProduct: 'aa-alkaline-batteries',
		subcategories: [
			{ slug: 'electrical', name: 'Electrical & Batteries' },
			{ slug: 'tools', name: 'Hand Tools' },
			{ slug: 'safety', name: 'Gloves & Safety' },
			{ slug: 'storage', name: 'Storage & Containers' }
		]
	},
	{
		slug: 'gardening-outdoor',
		name: 'Gardening & Outdoor',
		shortName: 'Garden',
		description: 'Garden gloves, watering cans, hand tools, planters, potting soil, fertiliser and seeds.',
		icon: 'sprout',
		coverProduct: 'potting-soil-20l',
		subcategories: [
			{ slug: 'garden-tools', name: 'Garden Tools' },
			{ slug: 'soil-fertiliser', name: 'Soil & Fertiliser' },
			{ slug: 'seeds-planters', name: 'Seeds & Planters' }
		]
	},
	{
		slug: 'chemicals',
		name: 'Chemicals',
		shortName: 'Chemicals',
		description:
			'Commercial cleaning chemicals, disinfectants and solvents for trade buyers. Supplied with safety data sheets; handle and store as labelled.',
		icon: 'flask',
		coverProduct: 'sodium-hypochlorite-25l',
		regulated: true,
		subcategories: [
			{ slug: 'industrial-cleaning', name: 'Industrial Cleaning' },
			{ slug: 'disinfectants', name: 'Disinfectants' },
			{ slug: 'solvents', name: 'Solvents' }
		]
	}
];

/** Attach each category's collage photo when one exists in src/lib/assets/categories/. */
export const categories: Category[] = categoryData.map((c) => ({ ...c, image: categoryImage(c.slug) }));

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
	return bySlug.get(slug);
}

export function getSubcategory(categorySlug: string, subSlug: string) {
	return bySlug.get(categorySlug)?.subcategories.find((s) => s.slug === subSlug);
}

export function categoryHref(slug: string, subSlug?: string): string {
	return subSlug ? `/shop/${slug}/${subSlug}` : `/shop/${slug}`;
}
