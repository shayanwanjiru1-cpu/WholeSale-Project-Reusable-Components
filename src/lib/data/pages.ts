import { ORDER_POLICY, formatPrice } from '$lib/catalog/pricing';
import { site } from './site';

/** Simple content pages. Fictional demo policies — not real terms. */
export interface InfoPage {
	title: string;
	description: string;
	sections: { heading: string; body: string[] }[];
}

export const pages: Record<string, InfoPage> = {
	about: {
		title: 'About us',
		description: `${site.name} is a fictional general wholesale supplier built to demonstrate a reusable B2B storefront.`,
		sections: [
			{ heading: 'Who we supply', body: ['Shops, mini-marts, restaurants, hotels, schools, offices, cleaning contractors and facilities teams that buy everyday goods in bulk.'] },
			{ heading: 'What we stock', body: ['Food and grocery staples, beverages, cleaning and household products, personal care, packaging and food-service supplies, stationery, hardware, gardening and trade chemicals.'] }
		]
	},
	wholesale: {
		title: 'Wholesale information',
		description: 'How minimum orders, tiered pricing and business accounts work.',
		sections: [
			{ heading: 'Minimum order', body: [`Orders need a subtotal of at least ${formatPrice(ORDER_POLICY.minimumOrderValue)}. Each product also has a minimum order quantity (MOQ), shown on the product.`] },
			{ heading: 'Tiered pricing', body: ['Unit prices step down at 10+ and 50+ units unless a product shows its own price breaks. The best applicable price is applied in your cart.'] },
			{ heading: 'Business accounts', body: ['Accounts can have several buyers. Orders above a buyer’s limit are routed to an approver before dispatch.'] }
		]
	},
	'payment-terms': {
		title: 'Payment terms',
		description: 'Prepaid, Net-30 and Net-60 options.',
		sections: [
			{ heading: 'Prepaid', body: ['Pay by M-Pesa, bank transfer or card before dispatch. Available to every account.'] },
			{ heading: 'Net-30 and Net-60', body: ['Approved accounts can be invoiced with 30 or 60 days to pay. A purchase order number is required for orders on terms. Credit limits apply.'] }
		]
	},
	shipping: {
		title: 'Shipping & delivery',
		description: 'Business delivery within the delivery zone.',
		sections: [
			{ heading: 'Delivery charges', body: [`Free delivery on orders over ${formatPrice(ORDER_POLICY.freeDeliveryThreshold)}; otherwise ${formatPrice(ORDER_POLICY.deliveryFee)} per drop.`] },
			{ heading: 'Lead times', body: ['In-stock items usually dispatch within 1–3 working days. Backorder lead times are shown on each product.'] },
			{ heading: 'Chemicals', body: ['Hazardous goods are packed and transported according to their labelling and supplied with safety data sheets.'] }
		]
	},
	returns: {
		title: 'Returns',
		description: 'Damaged, short or incorrect deliveries.',
		sections: [{ heading: 'Reporting a problem', body: ['Report damaged, short or incorrect deliveries within 48 hours with your order number. Opened chemicals and food items cannot be returned unless faulty.'] }]
	},
	help: {
		title: 'Help centre',
		description: 'Answers for wholesale buyers.',
		sections: [
			{ heading: 'Ordering', body: ['Search by name, brand or SKU, add products to the cart at or above their MOQ, and check out on your account terms.'] },
			{ heading: 'Quotes', body: ['Use “Request quote” on any product, or the quote page for large, recurring or custom orders.'] },
			{ heading: 'Bulk upload', body: ['Upload a CSV of SKUs and quantities on the bulk order page to build an order in one step.'] }
		]
	},
	contact: {
		title: 'Contact',
		description: 'Sales and order support.',
		sections: [{ heading: 'Order support', body: [`Phone: ${site.phone}`, `Email: ${site.email}`, `Address: ${site.address}`, `Hours: ${site.hours}`, 'All contact details are placeholders for this demo.'] }]
	},
	privacy: { title: 'Privacy', description: 'Placeholder privacy notice.', sections: [{ heading: 'Demo notice', body: ['This demo stores your cart, quote list and theme preference in your browser only. No personal data is sent anywhere.'] }] },
	terms: { title: 'Terms', description: 'Placeholder terms of sale.', sections: [{ heading: 'Demo notice', body: ['This is a demonstration storefront. No orders are fulfilled and prices are not offers.'] }] },
	cookies: { title: 'Cookies', description: 'Placeholder cookie information.', sections: [{ heading: 'Local storage', body: ['The demo uses browser local storage (not cookies) for the cart, quote list and theme preference.'] }] }
};
