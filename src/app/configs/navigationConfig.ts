import i18next from 'i18next';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	// {
	// 	id: 'Products-component',
	// 	title: 'Products',
	// 	translate: 'Products',
	// 	type: 'item',
	// 	icon: 'heroicons-outline:star',
	// 	url: 'Products'
	// },
	{
		id: 'Admin-component',
		title: 'AdminUsers',
		translate: 'AdminUsers',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'admins'
	},
	{
		id: 'Customer-component',
		title: 'Customers',
		translate: 'Customers',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'customer'
	},
	{
		id: 'Vendor-component',
		title: 'Vendors',
		translate: 'Vendors',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'vendors'
	},
	{
		id: 'Rider-component',
		title: 'Riders',
		translate: 'Riders',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'riders'
	},
	{
		id: 'Dispatcher-component',
		title: 'Dispatchers',
		translate: 'Dispatchers',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'dispatchers'
	},
	{
		id: 'Restaurant-component',
		title: 'Restaurants',
		translate: 'Restaurants',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'restaurants'
	},
	{
		id: 'PromoCode-component',
		title: 'PromoCodes',
		translate: 'PromoCodes',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'promocodes'
	},
	{
		id: 'PromotionalCode-component',
		title: 'PromotionalSlider',
		translate: 'PromotionalSlider',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'promotional-sliders'
	},
	{
		id: 'Beach-component',
		title: 'Beach',
		translate: 'Beach',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'beaches'
	},
	{
		id: 'Event-component',
		title: 'Event',
		translate: 'Event',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'events'
	},
	{
		id: 'Meuseum-component',
		title: 'Meuseum',
		translate: 'Meuseum',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'meuseums'
	},
	{
		id: 'Enterprise-component',
		title: 'Enterprise',
		translate: 'Enterprise',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'enterprise'
	}
];

export default navigationConfig;
