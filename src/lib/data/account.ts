import type { Order, OrderStatus, PaymentTerms, Tone } from '$lib/types';
import { getProduct } from './products';
import { unitPriceFor } from '$lib/catalog/pricing';

/**
 * Mock signed-in business account (multi-buyer). Replace with the Customer /
 * Authentication API. All people and companies here are fictional.
 */
export const account = {
	company: 'Mwangaza Mini-Mart Ltd (demo)',
	accountNumber: 'ACC-20417',
	buyer: { name: 'Amina Otieno', role: 'Buyer', email: 'amina@mwangaza.example' },
	approver: { name: 'Daniel Kariuki', role: 'Purchasing manager' },
	/** Orders above this total need approver sign-off. */
	approvalLimit: 100000,
	approvedTerms: ['prepaid', 'net-30'] as PaymentTerms[],
	creditLimit: 500000,
	creditUsed: 182400,
	buyers: [
		{ name: 'Amina Otieno', role: 'Buyer', status: 'Active' },
		{ name: 'Brian Mutua', role: 'Buyer', status: 'Active' },
		{ name: 'Daniel Kariuki', role: 'Approver', status: 'Active' },
		{ name: 'Grace Njeri', role: 'Buyer', status: 'Invited' }
	]
};

export const PAYMENT_TERMS: { value: PaymentTerms; label: string; description: string }[] = [
	{ value: 'prepaid', label: 'Prepaid', description: 'Pay by M-Pesa, bank transfer or card before dispatch.' },
	{ value: 'net-30', label: 'Net-30', description: 'Invoice due 30 days after delivery.' },
	{ value: 'net-60', label: 'Net-60', description: 'Invoice due 60 days after delivery. Requires credit approval.' }
];

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
	'pending-approval': { label: 'Awaiting approval', tone: 'warning' },
	approved: { label: 'Approved', tone: 'info' },
	processing: { label: 'Processing', tone: 'info' },
	shipped: { label: 'Shipped', tone: 'primary' },
	delivered: { label: 'Delivered', tone: 'success' },
	cancelled: { label: 'Cancelled', tone: 'neutral' }
};

function order(id: string, placedAt: string, placedBy: string, status: OrderStatus, terms: PaymentTerms, lines: [string, number][], poNumber?: string): Order {
	const resolved = lines.flatMap(([sku, quantity]) => {
		const p = getProduct(sku);
		return p ? [{ sku, name: p.name, quantity, unitPrice: unitPriceFor(p, quantity) }] : [];
	});
	return {
		id,
		poNumber,
		placedAt,
		placedBy,
		status,
		terms,
		lines: resolved,
		total: resolved.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
		currency: 'KES'
	};
}

export const orders: Order[] = [
	order('SO-10482', '2026-10-27', 'Amina Otieno', 'pending-approval', 'net-30', [['WS-FG-1001', 20], ['WS-FG-1003', 10], ['WS-FG-1005', 6]], 'PO-7781'),
	order('SO-10455', '2026-10-21', 'Brian Mutua', 'shipped', 'net-30', [['WS-CH-3001', 6], ['WS-CH-3002', 6], ['WS-CH-3004', 10], ['WS-CH-3010', 12]], 'PO-7764'),
	order('SO-10431', '2026-10-14', 'Amina Otieno', 'delivered', 'prepaid', [['WS-BV-2001', 4], ['WS-BV-2003', 40], ['WS-BV-2005', 20]]),
	order('SO-10398', '2026-10-02', 'Amina Otieno', 'delivered', 'net-30', [['WS-FG-1007', 15], ['WS-FG-1008', 15], ['WS-FG-1023', 20], ['WS-FG-1011', 10]], 'PO-7702'),
	order('SO-10360', '2026-09-23', 'Brian Mutua', 'delivered', 'net-30', [['WS-PK-5001', 4], ['WS-PK-5004', 3], ['WS-PK-5009', 2]], 'PO-7688'),
	order('SO-10322', '2026-09-11', 'Amina Otieno', 'cancelled', 'prepaid', [['WS-HW-7001', 2], ['WS-HW-7002', 1]]),
	order('SO-10297', '2026-09-03', 'Brian Mutua', 'delivered', 'net-30', [['WS-PC-4001', 3], ['WS-PC-4005', 2], ['WS-PC-4010', 2]], 'PO-7650')
];

/** Products this account orders most often (for Quick Reorder). */
export function frequentlyOrdered(limit = 6) {
	const counts = new Map<string, { qty: number; times: number }>();
	for (const o of orders) {
		if (o.status === 'cancelled') continue;
		for (const l of o.lines) {
			const c = counts.get(l.sku) ?? { qty: 0, times: 0 };
			counts.set(l.sku, { qty: Math.max(c.qty, l.quantity), times: c.times + 1 });
		}
	}
	return [...counts.entries()]
		.sort((a, b) => b[1].times - a[1].times || b[1].qty - a[1].qty)
		.slice(0, limit)
		.flatMap(([sku, c]) => {
			const product = getProduct(sku);
			return product ? [{ product, lastQuantity: c.qty, times: c.times }] : [];
		});
}
