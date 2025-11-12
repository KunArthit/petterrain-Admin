import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import en from './navigation-i18n/en';
import th from './navigation-i18n/th';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('th', 'navigation', th);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 * Organized by functional groups for better user experience.
 */

const access = JSON.parse(localStorage.getItem('type_access'));

const navigationConfig: FuseNavItemType[] = [
	// ====== ANALYTICS & REPORTING ======
	{
		id: 'analytics-reporting',
		title: 'Analytics & Reporting',
		// subtitle: i18n.t('navigation:ANALYTICS_REPORTING_SUBTITLE'),
		type: 'group',
		icon: 'heroicons-outline:chart-bar',
		translate: 'ANALYTICS_REPORTING',
		children: [
			{
				id: 'dashboards.project',
				title: 'Products Overview',
				translate: 'ProductsOverview',
				type: 'item',
				icon: 'heroicons-outline:clipboard-document-check',
				url: '/dashboards/project'
			},
			{
				id: 'dashboards.analytics',
				title: 'Order Analytics',
				translate: 'OrderAnalytics',
				type: 'item',
				icon: 'heroicons-outline:chart-pie',
				url: '/dashboards/analytics'
			},
			{
				id: 'dashboards.finance',
				title: 'Finance Dashboard',
				translate: 'Finance',
				type: 'item',
				icon: 'heroicons-outline:banknotes',
				url: '/dashboards/finance'
			},
			{
				id: 'google-analytics',
				title: 'Google Analytics',
				type: 'item',
				icon: 'heroicons-outline:chart-bar',
				target: '_blank',
				url: 'https://analytics.google.com/analytics/web/#/p472438929/reports/intelligenthome'
			}
		]
	},

	// ====== E-COMMERCE MANAGEMENT ======
	{
		id: 'ecommerce-management',
		title: 'E-Commerce Management',
		// subtitle: i18n.t('navigation:ECOMMERCE_MANAGEMENT_SUBTITLE'),
		type: 'group',
		icon: 'heroicons-outline:shopping-cart',
		translate: 'ECOMMERCE_MANAGEMENT',
		children: [
			{
				id: 'apps.ecommerce.products',
				title: 'Product Management',
				type: 'collapse',
				icon: 'heroicons-outline:cube',
				translate: 'PRODUCT_MANAGEMENT',
				children: [
					{
						id: 'e-commerce-products',
						title: 'Products',
						translate: 'PRODUCTS',
						type: 'item',
						url: '/apps/e-commerce/products',
						end: true
					},
					{
						id: 'e-commerce-categories',
						title: 'Product Categories',
						translate: 'MANAGECATEGORIES',
						type: 'item',
						url: 'manage-category',
					}
				]
			},
			{
				id: 'apps.ecommerce.orders',
				title: 'Order Management',
				type: 'collapse',
				icon: 'heroicons-outline:shopping-bag',
				translate: 'ORDER_MANAGEMENT',
				children: [
					{
						id: 'e-commerce-orders',
						title: 'Regular Orders',
						translate: 'ORDERS',
						type: 'item',
						url: '/apps/e-commerce/orders',
						end: true
					},
					{
						id: 'e-commerce-payments',
						title: 'Payments',
						translate: 'PAYMENTS',
						type: 'item',
						url: '/apps/e-commerce/payments',
					}
					
				]
			},
			// {
			// 	id: 'apps.invoice',
			// 	title: 'Invoice Management',
			// 	translate: 'INVOICE_MANAGEMENT',
			// 	type: 'collapse',
			// 	icon: 'heroicons-outline:calculator',
			// 	children: [
			// 		{
			// 			id: 'pages.invoice.compact',
			// 			title: 'Compact Invoice',
			// 			translate: 'INVOICE',
			// 			type: 'item',
			// 			url: '/apps/invoice/compact'
			// 		},
			// 		{
			// 			id: 'pages.invoice.modern',
			// 			title: 'Modern Invoice',
			// 			type: 'item',
			// 			url: '/apps/invoice/modern'
			// 		}
			// 	]
			// }
		]
	},

	// ====== CONTENT MANAGEMENT ======
	{
		id: 'content-management',
		title: 'Content Management',
		// subtitle: i18n.t('navigation:CONTENT_MANAGEMENT_SUBTITLE'),
		type: 'group',
		icon: 'heroicons-outline:document-text',
		translate: 'CONTENT_MANAGEMENT',
		children: [
			{
				id: 'app.blog-management',
				title: 'Blog Management',
				type: 'collapse',
				icon: 'heroicons-outline:newspaper',
				translate: 'BLOG_MANAGEMENT',
				children: [
					{
						id: 'blog-component-view',
						title: 'All Blog Posts',
						translate: 'BlogManagement',
						type: 'item',
						url: '/apps/blogs/blogview',
						end: true
					},
					{
						id: 'blog-component-admin',
						title: 'Create New Post',
						translate: 'AddNewsBlog',
						type: 'item',
						url: '/apps/blogs/blogadmin',
						end: true
					},
					// {
					// 	id: 'blog-categories-management',
					// 	title: 'Blog Categories',
					// 	translate: 'BLOGCATEGORIESLISTS',
					// 	type: 'item',
					// 	url: '/apps/blog-categories/blogcategoriesview',
					// 	end: true
					// }
				]
			},
			{
				id: 'apps.solution-management',
				title: 'Solution Management',
				type: 'collapse',
				icon: 'heroicons-outline:cube-transparent',
				translate: 'SOLUTION_MANAGEMENT',
				children: [
					{
						id: 'apps.solution-manager',
						title: 'Solutions',
						type: 'item',
						url: '/apps/solution-categories',
						end: true,
						translate: 'Solutions'
					}
				]
			},
			// {
			// 	id: 'apps.media-management',
			// 	title: 'Media Management',
			// 	type: 'collapse',
			// 	icon: 'heroicons-outline:photo',
			// 	translate: 'MEDIA_MANAGEMENT',
			// 	children: [
			// 		{
			// 			id: 'apps.file-manager',
			// 			title: 'File Manager',
			// 			type: 'item',
			// 			url: '/apps/file-manager',
			// 			end: true,
			// 			translate: 'FILE_MANAGER'
			// 		},
			// 		// {
			// 		// 	id: 'apps.upload-images',
			// 		// 	title: 'Upload Images',
			// 		// 	translate: 'UPLOADIMAGES',
			// 		// 	type: 'item',
			// 		// 	url: '/upload-images',
			// 		// 	end: true
			// 		// }
			// 	]
			// }
		]
	},

	// ====== USER & ACCESS MANAGEMENT ======
	{
		id: 'user-access-management',
		title: 'User & Access Management',
		// subtitle: i18n.t('navigation:USER_ACCESS_MANAGEMENT_SUBTITLE'),
		type: 'group',
		icon: 'heroicons-outline:users',
		translate: 'USER_ACCESS_MANAGEMENT',
		children: [
			{
				id: 'app.user-management',
				title: 'User Management',
				type: 'collapse',
				icon: 'heroicons-outline:user-group',
				translate: 'USER_MANAGEMENT',
				children: [
					{
						id: 'user-management-view',
						title: 'User Directory',
						translate: 'UserLists',
						type: 'item',
						url: '/apps/user-management/userview',
						end: true
					},
					access === 6 && {
						id: 'user-management-roles',
						title: 'Role Management',
						translate: 'RoleManagement',
						type: 'item',
						url: '/apps/user-type-management/usertypeview',
						end: true
					}
				]
			},
			(access === 6 || access === 5 || access === 1) && {
				id: 'organizational-management',
				title: 'Organization Structure',
				type: 'collapse',
				icon: 'heroicons-outline:building-office-2',
				translate: 'ORGANIZATIONAL_MANAGEMENT',
				children: [
					{
						id: 'department-management',
						title: 'Departments',
						translate: 'DepartmentLists',
						type: 'item',
						url: '/apps/departments/departmentview',
						end: true
					}
				]
			}
		]
	},

	// ====== COMMUNICATION & COLLABORATION ======
	// {
	// 	id: 'communication-collaboration',
	// 	title: 'Communication & Collaboration',
	// 	subtitle: 'Chat, messaging, and team collaboration',
	// 	type: 'group',
	// 	icon: 'heroicons-outline:chat-bubble-left-right',
	// 	translate: 'COMMUNICATION_COLLABORATION',
	// 	children: [
	// 		{
	// 			id: 'apps.messenger',
	// 			title: 'Company Chat',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:chat-bubble-bottom-center',
	// 			url: '/apps/company-chat/messages',
	// 			translate: 'COMPANY_CHAT'
	// 		}
	// 	]
	// },

	// ====== SYSTEM CONFIGURATION ======
	{
		id: 'system-configuration',
		title: 'System Configuration',
		// subtitle: i18n.t('navigation:SYSTEM_CONFIGURATION_SUBTITLE'),
		type: 'group',
		icon: 'heroicons-outline:cog-6-tooth',
		translate: 'SYSTEM_CONFIGURATION',
		children: [
			{
				id: 'apps.theme-management',
				title: 'Theme Management',
				type: 'collapse',
				icon: 'heroicons-outline:paint-brush',
				translate: 'THEME_MANAGEMENT',
				children: [
					{
						id: 'apps.theme-color',
						title: 'Theme Colors',
						type: 'item',
						url: '/theme-management',
						end: true,
						translate: 'THEME_COLOR'
					}
				]
			}
		]
	}
];

export default navigationConfig;
