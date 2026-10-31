import type { HazardInfo, PriceTier, Product, StockStatus } from '$lib/types';
import { getCategory } from './categories';
import { productImage, productSprite } from './assets';
import { DEFAULT_CURRENCY, standardTiers } from '$lib/catalog/pricing';

/**
 * Mock wholesale catalog.
 *
 * All brands, SKUs, prices and stock levels are fictional demonstration data — they
 * are not real market prices or real companies' products. Prices are KES, per selling
 * unit, excluding VAT.
 *
 * `seeds` is the compact authoring format; `products` is the hydrated shape a
 * Products API would return (category names, URLs, images and tiers resolved).
 */
type Seed = {
	sku: string;
	slug: string;
	name: string;
	brand?: string;
	cat: string;
	sub: string;
	unit: string;
	pack?: string;
	casePack?: number;
	price: number;
	moq: number;
	alt: string;
	desc?: string;
	was?: number;
	stock?: StockStatus;
	qty?: number;
	lead?: number;
	featured?: boolean;
	/** false = net price, no quantity breaks. */
	tiers?: PriceTier[] | false;
	tags?: string[];
	hazard?: HazardInfo;
	quoteOnly?: boolean;
};

const CORROSIVE: HazardInfo = {
	signal: 'Danger',
	statements: ['Causes severe skin burns and eye damage.', 'Wear protective gloves, eye and face protection.', 'Do not mix with acids or other chemicals.'],
	note: 'Corrosive — trade use, handle with PPE'
};
const IRRITANT: HazardInfo = {
	signal: 'Warning',
	statements: ['Causes skin and serious eye irritation.', 'Keep out of reach of children.', 'Do not mix with other cleaning products.'],
	note: 'Irritant — keep away from food and children'
};
const FLAMMABLE: HazardInfo = {
	signal: 'Danger',
	statements: ['Highly flammable liquid and vapour.', 'Keep away from heat, sparks and open flames.', 'Store in a well-ventilated place; keep container closed.'],
	note: 'Flammable — store away from heat and ignition'
};

const seeds: Seed[] = [
	/* ---------------- Food & Grocery ---------------- */
	{ sku: 'WS-FG-1001', slug: 'long-grain-rice-25kg', name: 'Sona Masoori Rice', brand: 'Sona Masoori', cat: 'food-grocery', sub: 'rice-grains', unit: 'bale', pack: '5 × 5 kg', casePack: 5, price: 3450, moq: 5, featured: true, alt: '5 kg pack of Sona Masoori rice', desc: 'Aromatic medium-grain rice in 5 kg retail packs, sold by the bale of five. Cooks soft and separate — a fast mover for shops and kitchens.', tags: ['mchele', 'grain', 'staple', 'pishori'] },
	{ sku: 'WS-FG-1002', slug: 'basmati-rice-10kg', name: 'Premium Basmati Rice', brand: 'Sona', cat: 'food-grocery', sub: 'rice-grains', unit: 'bag', pack: '10 kg', price: 2150, moq: 5, alt: '10 kg bag of aged basmati rice', desc: 'Aged extra-long basmati with a natural aroma. Popular with hotels and restaurants.', tags: ['mchele', 'aromatic'] },
	{ sku: 'WS-FG-1003', slug: 'cooking-oil-20l', name: 'Pure Sunflower Oil 1 L', brand: 'Fry Royale', cat: 'food-grocery', sub: 'cooking-oil', unit: 'carton', pack: '12 × 1 L', casePack: 12, price: 3850, was: 4100, moq: 2, featured: true, alt: '1 litre bottle of pure sunflower cooking oil', desc: 'Light, refined sunflower oil in 1 L retail bottles. Carton of twelve.', tags: ['mafuta', 'fat', 'frying'] },
	{ sku: 'WS-FG-1004', slug: 'sunflower-oil-12x1l', name: 'Sunflower Oil 1 L Bottles', brand: 'Fry Royale', cat: 'food-grocery', sub: 'cooking-oil', unit: 'carton', pack: '12 × 1 L', casePack: 12, price: 4150, moq: 3, alt: 'Carton of twelve 1 litre bottles of sunflower oil', desc: 'Light sunflower oil in retail-ready 1 L bottles, 12 per carton.', tags: ['mafuta', 'retail'] },
	{ sku: 'WS-FG-1005', slug: 'white-sugar-50kg', name: 'White Sugar 2 kg', brand: 'SweetLeaf', cat: 'food-grocery', sub: 'sugar-salt', unit: 'bale', pack: '12 × 2 kg', casePack: 12, price: 3600, moq: 2, featured: true, stock: 'low-stock', qty: 38, alt: '2 kg pack of refined white sugar', desc: 'Fine refined white sugar in 2 kg retail packs, bale of twelve.', tags: ['sukari', 'sweetener'] },
	{ sku: 'WS-FG-1006', slug: 'white-sugar-24x1kg', name: 'White Sugar 1 kg Packs', brand: 'SweetLeaf', cat: 'food-grocery', sub: 'sugar-salt', unit: 'bale', pack: '24 × 1 kg', casePack: 24, price: 3650, moq: 3, alt: 'Bale of twenty-four 1 kg packs of white sugar', tags: ['sukari', 'retail'] },
	{ sku: 'WS-FG-1007', slug: 'all-purpose-flour-12x2kg', name: 'EXE All Purpose Flour 2 kg', brand: 'EXE', cat: 'food-grocery', sub: 'flour-baking', unit: 'bale', pack: '12 × 2 kg', casePack: 12, price: 2050, moq: 5, featured: true, alt: '2 kg pack of EXE all purpose wheat flour', desc: 'Fortified home-baking flour for chapati, mandazi and general baking.', tags: ['unga', 'wheat', 'baking', 'chapati'] },
	{ sku: 'WS-FG-1008', slug: 'maize-meal-12x2kg', name: 'Sifted Maize Meal', brand: 'Mavuno Mills', cat: 'food-grocery', sub: 'flour-baking', unit: 'bale', pack: '12 × 2 kg', casePack: 12, price: 1720, was: 1850, moq: 5, alt: 'Bale of twelve 2 kg packs of white maize meal', tags: ['unga', 'ugali', 'maize'] },
	{ sku: 'WS-FG-1009', slug: 'red-kidney-beans-50kg', name: 'Red Kidney Beans', brand: 'Harvest Select', cat: 'food-grocery', sub: 'rice-grains', unit: 'sack', pack: '50 kg', price: 8900, moq: 1, alt: '50 kg sack of dried red kidney beans', desc: 'Machine-cleaned dried beans, graded for size.', tags: ['maharagwe', 'pulses', 'legumes'] },
	{ sku: 'WS-FG-1010', slug: 'green-lentils-25kg', name: 'Green Lentils', brand: 'Harvest Select', cat: 'food-grocery', sub: 'rice-grains', unit: 'sack', pack: '25 kg', price: 5300, moq: 1, alt: '25 kg sack of green lentils', tags: ['ndengu', 'pulses', 'legumes'] },
	{ sku: 'WS-FG-1011', slug: 'spaghetti-20x500g', name: 'Spaghetti', brand: 'Pastella', cat: 'food-grocery', sub: 'pasta-cereals', unit: 'carton', pack: '20 × 500 g', casePack: 20, price: 2300, moq: 5, alt: 'Carton of twenty 500 g packs of spaghetti', tags: ['pasta', 'noodles'] },
	{ sku: 'WS-FG-1012', slug: 'macaroni-20x400g', name: 'Elbow Macaroni', brand: 'Pastella', cat: 'food-grocery', sub: 'pasta-cereals', unit: 'carton', pack: '20 × 400 g', casePack: 20, price: 1980, moq: 5, alt: 'Carton of twenty 400 g packs of elbow macaroni', tags: ['pasta'] },
	{ sku: 'WS-FG-1013', slug: 'corn-flakes-12x500g', name: 'Corn Flakes Breakfast Cereal', brand: 'Sunrise Grain', cat: 'food-grocery', sub: 'pasta-cereals', unit: 'carton', pack: '12 × 500 g', casePack: 12, price: 4100, moq: 2, alt: 'Carton of twelve 500 g boxes of corn flakes', tags: ['cereal', 'breakfast'] },
	{ sku: 'WS-FG-1014', slug: 'canned-tuna-48x185g', name: 'Tuna Chunks in Vegetable Oil', brand: 'Bahari', cat: 'food-grocery', sub: 'canned-goods', unit: 'case', pack: '48 × 185 g', casePack: 48, price: 9800, moq: 2, alt: 'Case of forty-eight 185 g cans of tuna chunks', tags: ['fish', 'canned fish', 'tinned'] },
	{ sku: 'WS-FG-1015', slug: 'canned-sardines-50x125g', name: 'Sardines in Tomato Sauce', brand: 'Bahari', cat: 'food-grocery', sub: 'canned-goods', unit: 'case', pack: '50 × 125 g', casePack: 50, price: 6250, moq: 2, alt: 'Case of fifty 125 g cans of sardines', tags: ['fish', 'canned fish', 'tinned'] },
	{ sku: 'WS-FG-1016', slug: 'tomato-sauce-12x400g', name: 'Tomato Sauce', brand: 'Red Valley', cat: 'food-grocery', sub: 'canned-goods', unit: 'carton', pack: '12 × 400 g', casePack: 12, price: 1850, moq: 4, alt: 'Carton of twelve 400 g bottles of tomato sauce', tags: ['ketchup', 'condiment'] },
	{ sku: 'WS-FG-1017', slug: 'baked-beans-24x420g', name: 'Baked Beans in Tomato Sauce', brand: 'Red Valley', cat: 'food-grocery', sub: 'canned-goods', unit: 'case', pack: '24 × 420 g', casePack: 24, price: 3350, moq: 2, alt: 'Case of twenty-four 420 g cans of baked beans', tags: ['tinned', 'beans'] },
	{ sku: 'WS-FG-1018', slug: 'cream-crackers-24x200g', name: 'Cream Crackers', brand: 'CrunchCo', cat: 'food-grocery', sub: 'snacks-confectionery', unit: 'carton', pack: '24 × 200 g', casePack: 24, price: 2650, was: 2900, moq: 3, alt: 'Carton of twenty-four packs of cream crackers', tags: ['biscuits', 'snacks'] },
	{ sku: 'WS-FG-1019', slug: 'glucose-biscuits-48x100g', name: 'Glucose Biscuits', brand: 'CrunchCo', cat: 'food-grocery', sub: 'snacks-confectionery', unit: 'carton', pack: '48 × 100 g', casePack: 48, price: 2100, moq: 3, alt: 'Carton of forty-eight packs of glucose biscuits', tags: ['biscuits', 'cookies', 'snacks'] },
	{ sku: 'WS-FG-1020', slug: 'salted-crisps-48x30g', name: 'Salted Potato Crisps', brand: 'CrunchCo', cat: 'food-grocery', sub: 'snacks-confectionery', unit: 'carton', pack: '48 × 30 g', casePack: 48, price: 1900, moq: 3, alt: 'Carton of forty-eight 30 g bags of salted crisps', tags: ['chips', 'snacks'] },
	{ sku: 'WS-FG-1021', slug: 'milk-chocolate-24x90g', name: 'Milk Chocolate Bars', brand: 'CocoaBay', cat: 'food-grocery', sub: 'snacks-confectionery', unit: 'box', pack: '24 × 90 g', casePack: 24, price: 3900, moq: 2, stock: 'low-stock', qty: 14, alt: 'Display box of twenty-four milk chocolate bars', tags: ['sweets', 'confectionery', 'candy'] },
	{ sku: 'WS-FG-1022', slug: 'fruit-sweets-6x1kg', name: 'Assorted Fruit Sweets', brand: 'CrunchCo', cat: 'food-grocery', sub: 'snacks-confectionery', unit: 'carton', pack: '6 × 1 kg jars', casePack: 6, price: 2700, moq: 2, alt: 'Carton of six 1 kg jars of assorted fruit sweets', tags: ['candy', 'confectionery', 'pipi'] },
	{ sku: 'WS-FG-1023', slug: 'iodised-salt-25x1kg', name: 'Iodised Table Salt', brand: 'Coast Crystal', cat: 'food-grocery', sub: 'sugar-salt', unit: 'bale', pack: '25 × 1 kg', casePack: 25, price: 950, moq: 10, alt: 'Bale of twenty-five 1 kg packs of iodised salt', tags: ['chumvi', 'seasoning'] },
	{ sku: 'WS-FG-1024', slug: 'curry-powder-12x100g', name: 'Curry Powder', brand: 'Spice Route', cat: 'food-grocery', sub: 'spices-seasoning', unit: 'carton', pack: '12 × 100 g', casePack: 12, price: 1150, moq: 5, alt: 'Carton of twelve 100 g packs of curry powder', tags: ['spices', 'masala'] },
	{ sku: 'WS-FG-1025', slug: 'pilau-masala-12x100g', name: 'Pilau Masala', brand: 'Spice Route', cat: 'food-grocery', sub: 'spices-seasoning', unit: 'carton', pack: '12 × 100 g', casePack: 12, price: 1250, moq: 5, alt: 'Carton of twelve 100 g packs of pilau masala', tags: ['spices', 'masala'] },

	/* ---------------- Beverages ---------------- */
	{ sku: 'WS-BV-2001', slug: 'black-tea-500g', name: 'Kenyan Tea 250 g', brand: 'Highland Leaf', cat: 'beverages', sub: 'tea-coffee', unit: 'carton', pack: '24 × 250 g', casePack: 24, price: 4300, moq: 2, featured: true, alt: '250 g box of Kenyan black tea', desc: 'Finest-quality Kenyan black tea in 250 g boxes — strong, bright chai for shops, offices and canteens.', tags: ['chai', 'majani'] },
	{ sku: 'WS-BV-2002', slug: 'ground-coffee-10x250g', name: 'Ground Arabica Coffee', brand: 'Kilele Coffee', cat: 'beverages', sub: 'tea-coffee', unit: 'carton', pack: '10 × 250 g', casePack: 10, price: 4800, moq: 2, alt: 'Carton of ten 250 g bags of ground coffee', tags: ['kahawa'] },
	{ sku: 'WS-BV-2003', slug: 'drinking-water-24x500ml', name: 'Drinking Water 500 ml', brand: 'Aqua Springs', cat: 'beverages', sub: 'water', unit: 'pack', pack: '24 × 500 ml', casePack: 24, price: 720, moq: 20, alt: 'Shrink-wrapped pack of twenty-four 500 ml water bottles', tags: ['maji', 'bottled water'] },
	{ sku: 'WS-BV-2004', slug: 'dispenser-water-18-9l', name: 'Dispenser Water Refill', brand: 'Aqua Springs', cat: 'beverages', sub: 'water', unit: 'bottle', pack: '18.9 L', price: 450, moq: 10, tiers: false, alt: '18.9 litre water dispenser bottle', tags: ['maji', 'office'] },
	{ sku: 'WS-BV-2005', slug: 'cola-24x300ml', name: 'Cola Soft Drink', brand: 'Fizzo', cat: 'beverages', sub: 'soft-drinks', unit: 'crate', pack: '24 × 300 ml', casePack: 24, price: 1150, moq: 10, alt: 'Crate of twenty-four 300 ml cola bottles', tags: ['soda', 'pop', 'fizzy'] },
	{ sku: 'WS-BV-2006', slug: 'mango-juice-12x1l', name: 'Mango Juice Drink', brand: 'Orchard Fresh', cat: 'beverages', sub: 'soft-drinks', unit: 'carton', pack: '12 × 1 L', casePack: 12, price: 2350, moq: 3, alt: 'Carton of twelve 1 litre mango juice packs', tags: ['juice'] },
	{ sku: 'WS-BV-2007', slug: 'energy-drink-24x250ml', name: 'Energy Drink Cans', brand: 'Volta', cat: 'beverages', sub: 'energy-drinks', unit: 'tray', pack: '24 × 250 ml', casePack: 24, price: 3100, was: 3400, moq: 3, alt: 'Tray of twenty-four 250 ml energy drink cans', tags: ['energy'] },
	{ sku: 'WS-BV-2008', slug: 'drinking-chocolate-12x400g', name: 'Drinking Chocolate Powder', brand: 'CocoaBay', cat: 'beverages', sub: 'powdered', unit: 'carton', pack: '12 × 400 g', casePack: 12, price: 4300, moq: 2, stock: 'backorder', lead: 14, alt: 'Carton of twelve 400 g tins of drinking chocolate', tags: ['cocoa', 'chocolate'] },
	{ sku: 'WS-BV-2009', slug: 'orange-squash-12x2l', name: 'Orange Squash Concentrate', brand: 'Orchard Fresh', cat: 'beverages', sub: 'powdered', unit: 'carton', pack: '12 × 2 L', casePack: 12, price: 3800, moq: 2, alt: 'Carton of twelve 2 litre bottles of orange squash', tags: ['juice', 'cordial'] },

	/* ---------------- Cleaning & Household ---------------- */
	{ sku: 'WS-CH-3001', slug: 'laundry-detergent-5kg', name: 'OMO Washing Powder 2 kg', brand: 'OMO', cat: 'cleaning-household', sub: 'laundry', unit: 'carton', pack: '9 × 2 kg', casePack: 9, price: 4450, moq: 2, featured: true, alt: '2 kg pack of OMO washing powder', desc: 'Hand and machine washing powder in 2 kg retail packs. Carton of nine.', tags: ['omo', 'washing powder', 'sabuni'] },
	{ sku: 'WS-CH-3002', slug: 'dishwashing-liquid-5l', name: 'Sunlight Dishwashing Liquid 750 ml', brand: 'Sunlight', cat: 'cleaning-household', sub: 'dishwashing', unit: 'carton', pack: '12 × 750 ml', casePack: 12, price: 2950, moq: 2, featured: true, alt: '750 ml bottle of Sunlight lemon dishwashing liquid', desc: 'Lemon dishwashing liquid that cuts grease fast, in 750 ml retail bottles.', tags: ['dish soap', 'washing up'] },
	{ sku: 'WS-CH-3003', slug: 'multipurpose-bar-soap', name: 'Dettol Original Soap 100 g', brand: 'Dettol', cat: 'personal-care', sub: 'bath-body', unit: 'carton', pack: '72 × 100 g', casePack: 72, price: 5400, moq: 2, featured: true, alt: '100 g bar of Dettol Original antibacterial soap', desc: 'Antibacterial bath soap in 100 g bars. Carton of seventy-two.', tags: ['bath soap', 'antibacterial', 'sabuni'] },
	{ sku: 'WS-CH-3004', slug: 'toilet-tissue-48', name: 'Velvex Toilet Tissue 4-Roll', brand: 'Velvex', cat: 'cleaning-household', sub: 'paper-products', unit: 'bale', pack: '12 × 4 rolls', casePack: 48, price: 2250, moq: 3, featured: true, alt: '4-roll pack of Velvex soft and strong toilet tissue', desc: 'Soft and strong 2-ply rolls in 4-roll retail packs. Bale of twelve packs.', tags: ['toilet paper', 'tissue'] },
	{ sku: 'WS-CH-3005', slug: 'fabric-softener-5l', name: 'Comfort Fabric Softener 2 L', brand: 'Comfort', cat: 'cleaning-household', sub: 'laundry', unit: 'carton', pack: '6 × 2 L', casePack: 6, price: 3300, moq: 2, featured: true, alt: '2 litre bottle of Comfort fabric softener', tags: ['conditioner', 'laundry'], desc: 'Concentrated fabric conditioner in 2 L bottles. Carton of six.' },
	{ sku: 'WS-CH-3006', slug: 'household-bleach-5l', name: 'Household Bleach', brand: 'ClearWhite', cat: 'cleaning-household', sub: 'surface-cleaners', unit: 'carton', pack: '4 × 5 L', casePack: 4, price: 2450, moq: 2, hazard: IRRITANT, alt: 'Carton of four 5 litre bottles of household bleach', tags: ['jik', 'whitener'] },
	{ sku: 'WS-CH-3007', slug: 'pine-disinfectant-5l', name: 'Pine Disinfectant', brand: 'GermGuard', cat: 'cleaning-household', sub: 'surface-cleaners', unit: 'carton', pack: '4 × 5 L', casePack: 4, price: 3600, moq: 2, hazard: IRRITANT, alt: 'Carton of four 5 litre bottles of pine disinfectant', tags: ['dettol', 'antiseptic', 'germ'] },
	{ sku: 'WS-CH-3008', slug: 'toilet-cleaner-12x500ml', name: 'Toilet Bowl Cleaner', brand: 'GermGuard', cat: 'cleaning-household', sub: 'surface-cleaners', unit: 'carton', pack: '12 × 500 ml', casePack: 12, price: 2050, moq: 2, hazard: IRRITANT, alt: 'Carton of twelve 500 ml toilet bowl cleaner bottles', tags: ['harpic', 'toilet'] },
	{ sku: 'WS-CH-3009', slug: 'glass-cleaner-12x500ml', name: 'Glass & Surface Cleaner Spray', brand: 'Sparkle', cat: 'cleaning-household', sub: 'surface-cleaners', unit: 'carton', pack: '12 × 500 ml', casePack: 12, price: 2400, moq: 2, alt: 'Carton of twelve 500 ml glass cleaner spray bottles', tags: ['window cleaner'] },
	{ sku: 'WS-CH-3010', slug: 'garbage-bags-heavy', name: 'Heavy Duty Garbage Bags 70 L', brand: 'TuffBag', cat: 'cleaning-household', sub: 'bags-liners', unit: 'carton', pack: '25 × 20 bags', casePack: 25, price: 3100, moq: 5, featured: true, alt: 'Roll of twenty black heavy duty 70 litre garbage bags', desc: 'Thick black 70 L bin liners on a roll of 20. Carton of twenty-five rolls.', tags: ['trash bags', 'garbage bags', 'bin bags', 'refuse'] },
	{ sku: 'WS-CH-3011', slug: 'sponge-scourers-10x10', name: 'Sponge Scourers', brand: 'ScrubPro', cat: 'cleaning-household', sub: 'cleaning-tools', unit: 'carton', pack: '10 × 10-pack', casePack: 10, price: 1450, moq: 3, alt: 'Carton of ten 10-packs of yellow and green sponge scourers', tags: ['scrubber', 'sponge'] },
	{ sku: 'WS-CH-3012', slug: 'cotton-mop-heads-12', name: 'Cotton Mop Heads', brand: 'ScrubPro', cat: 'cleaning-household', sub: 'cleaning-tools', unit: 'pack', pack: '12 pieces', price: 2900, moq: 2, alt: 'Pack of twelve cotton mop heads', tags: ['mop'] },
	{ sku: 'WS-CH-3013', slug: 'hard-broom-6', name: 'Hard Broom with Handle', brand: 'ScrubPro', cat: 'cleaning-household', sub: 'cleaning-tools', unit: 'pack', pack: '6 pieces', price: 2400, moq: 2, stock: 'out-of-stock', lead: 10, alt: 'Six hard-bristle brooms with wooden handles', tags: ['broom', 'brush', 'dustpan'] },
	{ sku: 'WS-CH-3014', slug: 'mop-bucket-wringer', name: 'Mop Bucket with Wringer 15 L', brand: 'ScrubPro', cat: 'cleaning-household', sub: 'cleaning-tools', unit: 'piece', pack: '15 L', price: 1650, moq: 2, alt: '15 litre plastic mop bucket with wringer', tags: ['bucket'] },
	{ sku: 'WS-CH-3015', slug: 'kitchen-towels-24', name: 'Kitchen Paper Towels', brand: 'Comfy Roll', cat: 'cleaning-household', sub: 'paper-products', unit: 'bale', pack: '24 rolls', casePack: 24, price: 2700, moq: 2, alt: 'Bale of twenty-four kitchen paper towel rolls', tags: ['serviettes', 'paper'] },
	{ sku: 'WS-CH-3016', slug: 'facial-tissues-36', name: 'Facial Tissues Box', brand: 'Comfy Roll', cat: 'cleaning-household', sub: 'paper-products', unit: 'carton', pack: '36 boxes', casePack: 36, price: 3300, moq: 2, alt: 'Carton of thirty-six facial tissue boxes', tags: ['tissue', 'serviettes'] },
	{ sku: 'WS-CH-3017', slug: 'household-gloves-12', name: 'Rubber Household Gloves', brand: 'ScrubPro', cat: 'cleaning-household', sub: 'cleaning-tools', unit: 'pack', pack: '12 pairs', price: 1350, moq: 3, alt: 'Pack of twelve pairs of yellow rubber household gloves', tags: ['gloves'] },

	/* ---------------- Personal Care ---------------- */
	{ sku: 'WS-PC-4001', slug: 'bath-soap-bar-pack', name: 'Beauty Bath Soap', brand: 'PureBar', cat: 'personal-care', sub: 'bath-body', unit: 'carton', pack: '72 × 100 g', casePack: 72, price: 5200, moq: 2, alt: 'Carton of seventy-two 100 g wrapped bath soap bars', tags: ['sabuni', 'soap', 'toilet soap'] },
	{ sku: 'WS-PC-4002', slug: 'liquid-hand-soap-4x5l', name: 'Liquid Hand Soap', brand: 'PureBar', cat: 'personal-care', sub: 'bath-body', unit: 'carton', pack: '4 × 5 L', casePack: 4, price: 3400, moq: 2, alt: 'Carton of four 5 litre bottles of liquid hand soap', tags: ['handwash', 'soap'] },
	{ sku: 'WS-PC-4003', slug: 'shampoo-12x400ml', name: 'Everyday Shampoo', brand: 'Silkara', cat: 'personal-care', sub: 'hair-care', unit: 'carton', pack: '12 × 400 ml', casePack: 12, price: 4600, moq: 2, alt: 'Carton of twelve 400 ml shampoo bottles', tags: ['hair'] },
	{ sku: 'WS-PC-4004', slug: 'conditioner-12x400ml', name: 'Moisture Conditioner', brand: 'Silkara', cat: 'personal-care', sub: 'hair-care', unit: 'carton', pack: '12 × 400 ml', casePack: 12, price: 4750, moq: 2, alt: 'Carton of twelve 400 ml conditioner bottles', tags: ['hair'] },
	{ sku: 'WS-PC-4005', slug: 'toothpaste-48x100ml', name: 'Fluoride Toothpaste', brand: 'BrightSmile', cat: 'personal-care', sub: 'oral-care', unit: 'carton', pack: '48 × 100 ml', casePack: 48, price: 5500, moq: 2, alt: 'Carton of forty-eight 100 ml toothpaste tubes', tags: ['dental', 'colgate'] },
	{ sku: 'WS-PC-4006', slug: 'toothbrushes-144', name: 'Medium Toothbrushes', brand: 'BrightSmile', cat: 'personal-care', sub: 'oral-care', unit: 'carton', pack: '12 × 12 pieces', casePack: 144, price: 3800, moq: 2, alt: 'Carton of one hundred and forty-four individually packed toothbrushes', tags: ['dental'] },
	{ sku: 'WS-PC-4007', slug: 'roll-on-deodorant-24', name: 'Roll-On Deodorant', brand: 'FreshDay', cat: 'personal-care', sub: 'bath-body', unit: 'carton', pack: '24 × 50 ml', casePack: 24, price: 4300, moq: 2, alt: 'Carton of twenty-four 50 ml roll-on deodorants', tags: ['antiperspirant'] },
	{ sku: 'WS-PC-4008', slug: 'body-lotion-12x400ml', name: 'Body Lotion', brand: 'Velvet Care', cat: 'personal-care', sub: 'bath-body', unit: 'carton', pack: '12 × 400 ml', casePack: 12, price: 3950, moq: 2, alt: 'Carton of twelve 400 ml body lotion bottles', tags: ['moisturiser', 'cream'] },
	{ sku: 'WS-PC-4009', slug: 'petroleum-jelly-24x250ml', name: 'Petroleum Jelly', brand: 'Velvet Care', cat: 'personal-care', sub: 'bath-body', unit: 'carton', pack: '24 × 250 ml', casePack: 24, price: 4100, was: 4450, moq: 2, alt: 'Carton of twenty-four 250 ml tubs of petroleum jelly', tags: ['vaseline', 'jelly'] },
	{ sku: 'WS-PC-4010', slug: 'sanitary-pads-48', name: 'Maxi Sanitary Pads', brand: 'Comfy', cat: 'personal-care', sub: 'hygiene', unit: 'carton', pack: '48 × 10 pads', casePack: 48, price: 7400, moq: 1, alt: 'Carton of forty-eight packs of sanitary pads', tags: ['always', 'feminine'] },
	{ sku: 'WS-PC-4011', slug: 'baby-wipes-24x80', name: 'Fragrance-Free Baby Wipes', brand: 'Little Ones', cat: 'personal-care', sub: 'baby-care', unit: 'carton', pack: '24 × 80 wipes', casePack: 24, price: 4700, moq: 2, alt: 'Carton of twenty-four packs of baby wipes', tags: ['wet wipes', 'baby'] },
	{ sku: 'WS-PC-4012', slug: 'baby-diapers-size3', name: 'Baby Diapers Size 3', brand: 'Little Ones', cat: 'personal-care', sub: 'baby-care', unit: 'bale', pack: '4 × 44 diapers', casePack: 4, price: 5900, moq: 1, stock: 'low-stock', qty: 22, alt: 'Bale of four packs of size 3 baby diapers', tags: ['nappies', 'pampers'] },
	{ sku: 'WS-PC-4013', slug: 'disposable-razors-20x5', name: 'Twin-Blade Disposable Razors', brand: 'SharpEdge', cat: 'personal-care', sub: 'hygiene', unit: 'box', pack: '20 × 5-pack', casePack: 20, price: 2500, moq: 2, alt: 'Box of twenty 5-packs of disposable razors', tags: ['shaving'] },
	{ sku: 'WS-PC-4014', slug: 'cotton-wool-24x100g', name: 'Cotton Wool Rolls', brand: 'Pure Cotton', cat: 'personal-care', sub: 'hygiene', unit: 'carton', pack: '24 × 100 g', casePack: 24, price: 2300, moq: 2, alt: 'Carton of twenty-four 100 g cotton wool rolls', tags: ['cotton', 'first aid'] },

	/* ---------------- Packaging & Food Service ---------------- */
	{ sku: 'WS-PK-5001', slug: 'kraft-paper-bags', name: 'Kraft Paper Bags, Medium', brand: 'PackRight', cat: 'packaging-food-service', sub: 'bags', unit: 'carton', pack: '1,000 bags', price: 3600, moq: 2, alt: 'Stack of brown kraft paper bags with flat handles', desc: 'Food-safe brown kraft bags with twisted handles. 26 × 12 × 32 cm.', tags: ['paper bags', 'carrier bags', 'shopping bags'] },
	{ sku: 'WS-PK-5002', slug: 'non-woven-bags-500', name: 'Non-Woven Carrier Bags', brand: 'PackRight', cat: 'packaging-food-service', sub: 'bags', unit: 'carton', pack: '500 bags', price: 4500, moq: 2, alt: 'Bundle of reusable non-woven carrier bags', tags: ['shopping bags', 'reusable'] },
	{ sku: 'WS-PK-5003', slug: 'takeaway-boxes-750ml', name: 'Kraft Takeaway Boxes 750 ml', brand: 'PackRight', cat: 'packaging-food-service', sub: 'takeaway', unit: 'carton', pack: '300 boxes', price: 3750, moq: 2, alt: 'Brown kraft takeaway food boxes with fold-over lids', tags: ['food containers', 'to-go'] },
	{ sku: 'WS-PK-5004', slug: 'paper-cups-8oz-1000', name: 'Paper Cups 8 oz', brand: 'PackRight', cat: 'packaging-food-service', sub: 'disposables', unit: 'carton', pack: '1,000 cups', price: 3200, moq: 2, alt: 'Stacks of white 8 oz single-wall paper cups', tags: ['disposable cups', 'coffee cups', 'plastic cups'] },
	{ sku: 'WS-PK-5005', slug: 'bagasse-plates-9in', name: 'Bagasse Plates 9"', brand: 'PackRight', cat: 'packaging-food-service', sub: 'disposables', unit: 'carton', pack: '500 plates', price: 3400, moq: 2, alt: 'Stack of round compostable bagasse plates', tags: ['disposable plates', 'paper plates'] },
	{ sku: 'WS-PK-5006', slug: 'wooden-cutlery-1000', name: 'Wooden Cutlery Mixed Set', brand: 'PackRight', cat: 'packaging-food-service', sub: 'disposables', unit: 'carton', pack: '1,000 pieces', price: 2600, moq: 2, alt: 'Disposable wooden forks, knives and spoons', tags: ['disposable cutlery', 'forks', 'spoons'] },
	{ sku: 'WS-PK-5007', slug: 'catering-foil-6', name: 'Catering Aluminium Foil 45 cm × 90 m', brand: 'WrapWell', cat: 'packaging-food-service', sub: 'wraps', unit: 'carton', pack: '6 rolls', casePack: 6, price: 4200, moq: 1, alt: 'Carton of six catering aluminium foil rolls', tags: ['foil', 'aluminum'] },
	{ sku: 'WS-PK-5008', slug: 'cling-film-6', name: 'Cling Film 45 cm × 300 m', brand: 'WrapWell', cat: 'packaging-food-service', sub: 'wraps', unit: 'carton', pack: '6 rolls', casePack: 6, price: 3900, moq: 1, alt: 'Carton of six cling film rolls in cutter boxes', tags: ['plastic wrap', 'film'] },
	{ sku: 'WS-PK-5009', slug: 'packaging-tape-36', name: 'Clear Packaging Tape 48 mm × 100 m', brand: 'PackRight', cat: 'packaging-food-service', sub: 'shipping', unit: 'carton', pack: '36 rolls', casePack: 36, price: 3100, moq: 1, alt: 'Carton of thirty-six rolls of clear packaging tape', tags: ['sellotape', 'tape'] },
	{ sku: 'WS-PK-5010', slug: 'shipping-cartons-25', name: 'Double-Wall Cartons 60 × 40 × 40 cm', brand: 'PackRight', cat: 'packaging-food-service', sub: 'shipping', unit: 'bundle', pack: '25 cartons', price: 3500, moq: 2, stock: 'backorder', lead: 7, alt: 'Bundle of flat-packed double-wall cardboard cartons', tags: ['boxes', 'cardboard'] },
	{ sku: 'WS-PK-5011', slug: 'food-storage-containers', name: 'Food Storage Containers 1 L', brand: 'StackIt', cat: 'packaging-food-service', sub: 'takeaway', unit: 'carton', pack: '50 containers', price: 2950, moq: 2, alt: 'Clear 1 litre plastic food storage containers with lids', tags: ['tupperware', 'containers'] },

	/* ---------------- Stationery & Office ---------------- */
	{ sku: 'WS-ST-6001', slug: 'exercise-books-96pg', name: 'A4 Spiral Notebooks', brand: 'Scholar', cat: 'stationery-office', sub: 'paper-notebooks', unit: 'carton', pack: '48 books', casePack: 48, price: 2600, moq: 3, featured: true, alt: 'Stack of A4 spiral-bound notebooks with black, blue and red covers', desc: 'A4 spiral-bound ruled notebooks with hard covers. Carton of forty-eight.', tags: ['notebooks', 'school', 'books'] },
	{ sku: 'WS-ST-6002', slug: 'ballpoint-pens-blue', name: 'Ballpoint Pens, Blue', brand: 'InkFlow', cat: 'stationery-office', sub: 'writing', unit: 'carton', pack: '20 boxes × 50', casePack: 1000, price: 4400, moq: 1, alt: 'Boxes of blue ballpoint pens', tags: ['biro', 'pens', 'bic'] },
	{ sku: 'WS-ST-6003', slug: 'hb-pencils-144', name: 'HB Pencils with Eraser', brand: 'Scholar', cat: 'stationery-office', sub: 'writing', unit: 'carton', pack: '12 boxes × 12', casePack: 144, price: 900, moq: 3, alt: 'Boxes of HB pencils with erasers', tags: ['pencils', 'school'] },
	{ sku: 'WS-ST-6004', slug: 'a4-copy-paper-5', name: 'A4 Copy Paper 80 gsm', brand: 'OfficePro', cat: 'stationery-office', sub: 'paper-notebooks', unit: 'box', pack: '5 reams', casePack: 5, price: 3050, moq: 2, alt: 'Box of five reams of white A4 copy paper', tags: ['printing paper', 'photocopy'] },
	{ sku: 'WS-ST-6005', slug: 'dl-envelopes-500', name: 'DL Envelopes, White', brand: 'OfficePro', cat: 'stationery-office', sub: 'filing', unit: 'box', pack: '500 envelopes', price: 1600, moq: 2, alt: 'Box of white DL envelopes', tags: ['envelopes'] },
	{ sku: 'WS-ST-6006', slug: 'box-files-24', name: 'Box Files, Foolscap', brand: 'OfficePro', cat: 'stationery-office', sub: 'filing', unit: 'carton', pack: '24 files', casePack: 24, price: 3600, moq: 1, alt: 'Carton of black foolscap box files', tags: ['files', 'folders'] },
	{ sku: 'WS-ST-6007', slug: 'desk-stapler-12', name: 'Desk Stapler, Full Strip', brand: 'OfficePro', cat: 'stationery-office', sub: 'office-tools', unit: 'box', pack: '12 staplers', casePack: 12, price: 3300, moq: 1, alt: 'Box of twelve metal desk staplers', tags: ['stapler'] },
	{ sku: 'WS-ST-6008', slug: 'staples-26-6', name: 'Staples 26/6', brand: 'OfficePro', cat: 'stationery-office', sub: 'office-tools', unit: 'carton', pack: '20 boxes × 5,000', casePack: 20, price: 1200, moq: 2, alt: 'Carton of boxed 26/6 staples', tags: ['staples', 'pins'] },
	{ sku: 'WS-ST-6009', slug: 'desktop-calculator-10', name: '12-Digit Desktop Calculator', brand: 'CalcPro', cat: 'stationery-office', sub: 'office-tools', unit: 'box', pack: '10 calculators', casePack: 10, price: 4900, moq: 1, stock: 'low-stock', qty: 9, alt: 'Box of ten 12-digit desktop calculators', tags: ['calculator'] },
	{ sku: 'WS-ST-6010', slug: 'sticky-notes-24', name: 'Sticky Notes 76 × 76 mm', brand: 'OfficePro', cat: 'stationery-office', sub: 'office-tools', unit: 'pack', pack: '24 pads', casePack: 24, price: 1450, moq: 2, alt: 'Pack of yellow sticky note pads', tags: ['post-it', 'notes'] },
	{ sku: 'WS-ST-6011', slug: 'permanent-markers-144', name: 'Permanent Markers, Assorted', brand: 'InkFlow', cat: 'stationery-office', sub: 'writing', unit: 'carton', pack: '12 × 12 markers', casePack: 144, price: 2900, moq: 1, alt: 'Boxes of assorted colour permanent markers', tags: ['markers', 'felt pens'] },

	/* ---------------- Hardware & General Supplies ---------------- */
	{ sku: 'WS-HW-7001', slug: 'aa-alkaline-batteries', name: 'Energizer Max AA Batteries', brand: 'Energizer', cat: 'hardware-supplies', sub: 'electrical', unit: 'carton', pack: '24 × 4-pack', casePack: 24, price: 3600, moq: 2, featured: true, alt: 'Energizer Max AA alkaline batteries, 4-pack', desc: 'Long-life 1.5 V alkaline AA cells on 4-pack retail cards.', tags: ['batteries', 'betri', 'cells'] },
	{ sku: 'WS-HW-7002', slug: 'extension-cord-4way', name: '6-Way Extension Cable with Switch', brand: 'VoltLink', cat: 'hardware-supplies', sub: 'electrical', unit: 'box', pack: '10 units', casePack: 10, price: 6800, moq: 1, featured: true, alt: 'White 6-way extension socket with red power switch', desc: 'Six-socket extension with a master switch and 3 m heavy-duty cable.', tags: ['extension cable', 'power strip', 'socket'] },
	{ sku: 'WS-HW-7003', slug: 'led-bulbs-9w-50', name: 'LED Bulbs 9 W E27', brand: 'LumaBright', cat: 'hardware-supplies', sub: 'electrical', unit: 'carton', pack: '50 bulbs', casePack: 50, price: 5500, was: 6100, moq: 1, alt: 'Carton of 9 watt LED light bulbs', tags: ['light bulbs', 'lamps'] },
	{ sku: 'WS-HW-7004', slug: 'duct-tape-24', name: 'Duct Tape 48 mm × 25 m', brand: 'TieFast', cat: 'hardware-supplies', sub: 'tools', unit: 'carton', pack: '24 rolls', casePack: 24, price: 3800, moq: 1, alt: 'Carton of silver duct tape rolls', tags: ['tape'] },
	{ sku: 'WS-HW-7005', slug: 'nylon-rope-100m', name: 'Nylon Rope 10 mm × 100 m', brand: 'TieFast', cat: 'hardware-supplies', sub: 'tools', unit: 'coil', pack: '100 m', price: 2400, moq: 2, alt: 'Coil of 10 mm nylon rope', tags: ['rope', 'cord'] },
	{ sku: 'WS-HW-7006', slug: 'screwdriver-set-10', name: '6-Piece Screwdriver Set', brand: 'ToolMaster', cat: 'hardware-supplies', sub: 'tools', unit: 'box', pack: '10 sets', casePack: 10, price: 4500, moq: 1, alt: 'Six-piece screwdriver set in a plastic case', tags: ['tools', 'screwdrivers'] },
	{ sku: 'WS-HW-7007', slug: 'combination-pliers-12', name: 'Combination Pliers 8"', brand: 'ToolMaster', cat: 'hardware-supplies', sub: 'tools', unit: 'box', pack: '12 pieces', casePack: 12, price: 4200, moq: 1, stock: 'low-stock', qty: 6, alt: 'Pair of insulated combination pliers', tags: ['tools', 'pliers'] },
	{ sku: 'WS-HW-7008', slug: 'work-gloves-120', name: 'Latex-Coated Work Gloves', brand: 'GripSafe', cat: 'hardware-supplies', sub: 'safety', unit: 'carton', pack: '120 pairs', casePack: 120, price: 7200, moq: 1, featured: true, alt: 'Pair of yellow knit work gloves with black latex-coated palms', desc: 'Crinkle-latex palm for grip on wet and dry surfaces. Size L.', tags: ['gloves', 'ppe', 'safety'] },
	{ sku: 'WS-HW-7009', slug: 'safety-goggles-20', name: 'Clear Safety Goggles', brand: 'GripSafe', cat: 'hardware-supplies', sub: 'safety', unit: 'box', pack: '20 pieces', casePack: 20, price: 3000, moq: 1, alt: 'Clear anti-fog safety goggles', tags: ['ppe', 'eye protection'] },
	{ sku: 'WS-HW-7010', slug: 'hi-vis-vests-20', name: 'Hi-Vis Safety Vests', brand: 'GripSafe', cat: 'hardware-supplies', sub: 'safety', unit: 'pack', pack: '20 vests', price: 3200, moq: 1, alt: 'Fluorescent yellow high-visibility safety vests', tags: ['ppe', 'reflective'] },
	{ sku: 'WS-HW-7011', slug: 'storage-boxes-45l', name: 'Stackable Storage Boxes 45 L', brand: 'StackIt', cat: 'hardware-supplies', sub: 'storage', unit: 'pack', pack: '10 boxes', price: 6500, moq: 1, alt: 'Clear stackable 45 litre storage boxes with lids', tags: ['containers', 'crates'] },

	/* ---------------- Gardening & Outdoor ---------------- */
	{ sku: 'WS-GD-8001', slug: 'garden-gloves-24', name: 'Garden Gloves', brand: 'GreenThumb', cat: 'gardening-outdoor', sub: 'garden-tools', unit: 'pack', pack: '24 pairs', price: 2900, moq: 1, alt: 'Pair of green cotton garden gloves', tags: ['gloves'] },
	{ sku: 'WS-GD-8002', slug: 'watering-can-10l', name: 'Watering Can 10 L', brand: 'GreenThumb', cat: 'gardening-outdoor', sub: 'garden-tools', unit: 'pack', pack: '6 cans', price: 2700, moq: 1, alt: 'Green plastic 10 litre watering can', tags: ['watering'] },
	{ sku: 'WS-GD-8003', slug: 'trowel-fork-set', name: 'Hand Trowel & Fork Set', brand: 'GreenThumb', cat: 'gardening-outdoor', sub: 'garden-tools', unit: 'box', pack: '10 sets', price: 3100, moq: 1, alt: 'Steel hand trowel and fork with wooden handles', tags: ['tools', 'shovel'] },
	{ sku: 'WS-GD-8004', slug: 'potting-soil-20l', name: 'Potting Mix 20 L', brand: 'GreenThumb', cat: 'gardening-outdoor', sub: 'soil-fertiliser', unit: 'pallet pack', pack: '10 × 20 L bags', casePack: 10, price: 4000, moq: 1, alt: 'Bags of dark potting soil mix', tags: ['soil', 'compost'] },
	{ sku: 'WS-GD-8005', slug: 'npk-fertiliser-50kg', name: 'NPK 17:17:17 Fertiliser', brand: 'GrowMax', cat: 'gardening-outdoor', sub: 'soil-fertiliser', unit: 'bag', pack: '50 kg', price: 6900, moq: 1, stock: 'backorder', lead: 21, alt: '50 kg bag of granular NPK fertiliser', tags: ['fertilizer', 'mbolea'] },
	{ sku: 'WS-GD-8006', slug: 'kale-seeds-50', name: 'Kale (Sukuma Wiki) Seeds', brand: 'GrowMax', cat: 'gardening-outdoor', sub: 'seeds-planters', unit: 'carton', pack: '50 × 25 g', casePack: 50, price: 2250, moq: 1, alt: 'Packets of kale vegetable seeds', tags: ['seeds', 'mbegu', 'vegetables'] },
	{ sku: 'WS-GD-8007', slug: 'plant-pots-25cm', name: 'Plastic Plant Pots 25 cm', brand: 'GreenThumb', cat: 'gardening-outdoor', sub: 'seeds-planters', unit: 'pack', pack: '50 pots', price: 2800, moq: 1, alt: 'Stack of black 25 cm plastic plant pots', tags: ['planters', 'containers'] },
	{ sku: 'WS-GD-8008', slug: 'patio-cleaner-4x5l', name: 'Outdoor Patio & Path Cleaner', brand: 'GreenThumb', cat: 'gardening-outdoor', sub: 'garden-tools', unit: 'carton', pack: '4 × 5 L', casePack: 4, price: 4400, moq: 1, hazard: IRRITANT, alt: 'Carton of outdoor patio cleaner bottles', tags: ['outdoor cleaning'] },

	/* ---------------- Chemicals (trade) ---------------- */
	{ sku: 'WS-CM-9001', slug: 'sodium-hypochlorite-25l', name: 'Sodium Hypochlorite 12.5%', brand: 'ChemPro', cat: 'chemicals', sub: 'disinfectants', unit: 'drum', pack: '25 L', price: 4600, moq: 2, hazard: CORROSIVE, alt: '25 litre sealed chemical drum labelled sodium hypochlorite', desc: 'Industrial-strength chlorine solution for water treatment and dilution into sanitisers. Supplied with a safety data sheet.', tags: ['chlorine', 'bleach', 'jik'] },
	{ sku: 'WS-CM-9002', slug: 'heavy-duty-degreaser-20l', name: 'Heavy-Duty Alkaline Degreaser', brand: 'ChemPro', cat: 'chemicals', sub: 'industrial-cleaning', unit: 'drum', pack: '20 L', price: 7800, moq: 1, hazard: CORROSIVE, alt: '20 litre drum of alkaline degreaser concentrate', tags: ['degreaser', 'kitchen', 'workshop'] },
	{ sku: 'WS-CM-9003', slug: 'quat-disinfectant-4x5l', name: 'QAC Disinfectant Concentrate', brand: 'ChemPro', cat: 'chemicals', sub: 'disinfectants', unit: 'carton', pack: '4 × 5 L', casePack: 4, price: 8400, moq: 1, hazard: IRRITANT, alt: 'Carton of four 5 litre disinfectant concentrate containers', tags: ['quaternary', 'sanitiser'] },
	{ sku: 'WS-CM-9004', slug: 'isopropyl-alcohol-20l', name: 'Isopropyl Alcohol 99%', brand: 'ChemPro', cat: 'chemicals', sub: 'solvents', unit: 'drum', pack: '20 L', price: 12500, moq: 1, hazard: FLAMMABLE, stock: 'low-stock', qty: 11, alt: '20 litre drum of isopropyl alcohol', tags: ['ipa', 'alcohol', 'solvent'] },
	{ sku: 'WS-CM-9005', slug: 'mineral-turpentine-20l', name: 'Mineral Turpentine', brand: 'ChemPro', cat: 'chemicals', sub: 'solvents', unit: 'drum', pack: '20 L', price: 6300, moq: 1, hazard: FLAMMABLE, alt: '20 litre drum of mineral turpentine', tags: ['thinner', 'turps', 'solvent'] },
	{ sku: 'WS-CM-9006', slug: 'caustic-soda-25kg', name: 'Caustic Soda Flakes', brand: 'ChemPro', cat: 'chemicals', sub: 'industrial-cleaning', unit: 'bag', pack: '25 kg', price: 5900, moq: 1, hazard: CORROSIVE, quoteOnly: true, alt: '25 kg lined bag of caustic soda flakes', desc: 'Sodium hydroxide flakes for soap-making and industrial cleaning. Supplied to verified trade accounts only — request a quote.', tags: ['sodium hydroxide', 'lye'] }
];

/* ---------- Hydration ---------- */

/** Stable pseudo-random number from a string (deterministic mock popularity / dates). */
function hash(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return (h >>> 0) / 4294967295;
}

function hydrate(seed: Seed, index: number): Product {
	const category = getCategory(seed.cat);
	if (!category) throw new Error(`Unknown category "${seed.cat}" for ${seed.sku}`);
	const sub = category.subcategories.find((s) => s.slug === seed.sub);
	if (!sub) throw new Error(`Unknown subcategory "${seed.sub}" for ${seed.sku}`);
	const h = hash(seed.sku);
	const added = new Date(Date.UTC(2026, 0, 1) + Math.floor(h * 290) * 86400000);
	return {
		id: seed.sku,
		sku: seed.sku,
		slug: seed.slug,
		name: seed.name,
		category: category.slug,
		categoryName: category.name,
		subcategory: sub.slug,
		subcategoryName: sub.name,
		brand: seed.brand,
		image: productImage(seed.slug),
		sprite: productSprite(seed.slug),
		imageAlt: seed.alt,
		description: seed.desc,
		unit: seed.unit,
		packSize: seed.pack,
		casePack: seed.casePack,
		price: seed.price,
		compareAtPrice: seed.was,
		currency: DEFAULT_CURRENCY,
		tiers: seed.tiers === false ? [] : (seed.tiers ?? standardTiers(seed.price)),
		moq: seed.moq,
		stockStatus: seed.stock ?? 'in-stock',
		stockQty: seed.qty,
		leadTimeDays: seed.lead ?? (seed.stock ? undefined : 1 + (index % 3)),
		featured: seed.featured,
		sale: seed.was !== undefined,
		popularity: Math.round(h * 1000) + (seed.featured ? 400 : 0),
		addedAt: added.toISOString().slice(0, 10),
		tags: seed.tags,
		hazard: seed.hazard,
		quoteOnly: seed.quoteOnly,
		href: `/shop/${category.slug}/${sub.slug}/${seed.sku.toLowerCase()}`
	};
}

export const products: Product[] = seeds.map(hydrate);

const bySku = new Map(products.map((p) => [p.sku.toLowerCase(), p]));

export function getProduct(sku: string): Product | undefined {
	return bySku.get(sku.toLowerCase());
}

/** Same list with photographed products first (stable), so grids lead with real imagery. */
export function photoFirst(list: Product[]): Product[] {
	return [...list].sort((a, b) => Number(!!b.image) - Number(!!a.image));
}

export const featuredProducts = products.filter((p) => p.featured);
export const saleProducts = products.filter((p) => p.sale);
export const popularProducts = [...products].sort((a, b) => b.popularity - a.popularity);

export function productsInCategory(slug: string, sub?: string): Product[] {
	return products.filter((p) => p.category === slug && (!sub || p.subcategory === sub));
}

/** Same subcategory first, then same category; excludes the product itself. */
export function relatedProducts(product: Product, limit = 4): Product[] {
	const sameSub = products.filter((p) => p.id !== product.id && p.subcategory === product.subcategory);
	const sameCat = products.filter((p) => p.id !== product.id && p.category === product.category && p.subcategory !== product.subcategory);
	return [...sameSub, ...sameCat].slice(0, limit);
}

export const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort() as string[];
