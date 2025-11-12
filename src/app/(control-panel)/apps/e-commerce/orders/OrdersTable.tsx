// /* eslint-disable no-prototype-builtins */
// import { useMemo, useState, useEffect } from 'react';
// import { type MRT_ColumnDef } from 'material-react-table';
// import DataTable from 'src/components/data-table/DataTable';
// import TrackingStatus from './order/tabs/details/TrackingStatus';
// import {
// 	ListItemIcon,
// 	MenuItem,
// 	Paper,
// 	Dialog,
// 	DialogTitle,
// 	DialogContent,
// 	DialogActions,
// 	TextField,
// 	IconButton,
// 	Snackbar,
// 	Alert,
// 	Box,
// 	Grid,
// 	Chip,
// 	alpha
// } from '@mui/material';
// import {
// 	LocalShipping as TrackingIcon,
// 	Close as CloseIcon,
// 	CheckCircle as CheckCircleIcon,
// 	AccessTime as AccessTimeIcon,
// 	Cancel as CancelIcon,
// 	ErrorOutline as ErrorIcon,
// 	Pending as PendingIcon,
// 	Payment as PaymentIcon,
// 	Preview as PreviewIcon,
// 	TrendingUp as TrendingUpIcon,
// 	Email as EmailIcon,
// 	ConfirmationNumber as ConfirmIcon
// } from '@mui/icons-material';
// // import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Link from '@fuse/core/Link';
// import FuseLoading from '@fuse/core/FuseLoading';
// import {
// 	Order,
// 	useGetOrdersFromNewApiQuery,
// 	useDeleteOrdersFromNewApiMutation,
// 	useUpdateOrderTrackingMutation
// } from '../ECommerceApi';
// import { CreditCardIcon } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

// // Extended Order interface to include tracking status
// interface OrderWithTrackingStatus extends Order {
// 	trackingStatus?: 'pending' | 'shipped' | 'delivered' | 'exception' | null;
// }

// // Status configuration with modern Material-UI colors and icons (moved outside component)
// const statusConfig: Record<string, { color: string; bgColor: string; icon: any; category: string }> = {
// 	'Awaiting check payment': {
// 		color: '#1976d2',
// 		bgColor: alpha('#1976d2', 0.1),
// 		icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
// 		category: 'pending'
// 	},
// 	'Awaiting bank wire payment': {
// 		color: '#0277bd',
// 		bgColor: alpha('#0277bd', 0.1),
// 		icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
// 		category: 'pending'
// 	},
// 	'Awaiting PayPal payment': {
// 		color: '#01579b',
// 		bgColor: alpha('#01579b', 0.1),
// 		icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
// 		category: 'pending'
// 	},
// 	'Awaiting Cash-on-delivery payment': {
// 		color: '#0d47a1',
// 		bgColor: alpha('#0d47a1', 0.1),
// 		icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
// 		category: 'pending'
// 	},
// 	'Payment accepted': {
// 		color: '#2e7d32',
// 		bgColor: alpha('#2e7d32', 0.1),
// 		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
// 		category: 'processing'
// 	},
// 	'Remote payment accepted': {
// 		color: '#1b5e20',
// 		bgColor: alpha('#1b5e20', 0.1),
// 		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
// 		category: 'processing'
// 	},
// 	'Preparing the order': {
// 		color: '#ed6c02',
// 		bgColor: alpha('#ed6c02', 0.1),
// 		icon: <PendingIcon sx={{ fontSize: 20 }} />,
// 		category: 'processing'
// 	},
// 	Shipped: {
// 		color: '#9c27b0',
// 		bgColor: alpha('#9c27b0', 0.1),
// 		icon: <TrackingIcon sx={{ fontSize: 20 }} />,
// 		category: 'shipped'
// 	},
// 	Delivered: {
// 		// <-- คงไว้เผื่อมีข้อมูลเก่า
// 		color: '#1b5e20',
// 		bgColor: alpha('#1b5e20', 0.1),
// 		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
// 		category: 'completed'
// 	},
// 	Completed: {
// 		// <-- เพิ่ม 'Completed'
// 		color: '#1b5e20',
// 		bgColor: alpha('#1b5e20', 0.1),
// 		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
// 		category: 'completed'
// 	},
// 	Canceled: {
// 		color: '#d32f2f',
// 		bgColor: alpha('#d32f2f', 0.1),
// 		icon: <CancelIcon sx={{ fontSize: 20 }} />,
// 		category: 'canceled'
// 	},
// 	Refunded: {
// 		color: '#c62828',
// 		bgColor: alpha('#c62828', 0.1),
// 		icon: <ErrorIcon sx={{ fontSize: 20 }} />,
// 		category: 'canceled'
// 	},
// 	'Payment error': {
// 		color: '#b71c1c',
// 		bgColor: alpha('#b71c1c', 0.1),
// 		icon: <ErrorIcon sx={{ fontSize: 20 }} />,
// 		category: 'error'
// 	},
// 	'On pre-order (paid)': {
// 		color: '#7b1fa2',
// 		bgColor: alpha('#7b1fa2', 0.1),
// 		icon: <PaymentIcon sx={{ fontSize: 20 }} />,
// 		category: 'pending'
// 	},
// 	'On pre-order (not paid)': {
// 		color: '#4a148c',
// 		bgColor: alpha('#4a148c', 0.1),
// 		icon: <PreviewIcon sx={{ fontSize: 20 }} />,
// 		category: 'pending'
// 	},
// 	paid: {
// 		color: '#2e7d32',
// 		bgColor: alpha('#2e7d32', 0.1),
// 		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
// 		category: 'processing'
// 	}
// 	// 'completed' (ตัวเล็ก) จะถูกจัดการใน Cell renderer โดยตรง
// };

// // Improved tracking status checker that works with your TrackingStatus component
// async function getTrackingStatusFromAPI(
// 	trackingNumber: string
// ): Promise<'pending' | 'shipped' | 'delivered' | 'exception' | null> {
// 	try {
// 		// Option 1: If you have a direct API endpoint to check tracking status
// 		const API_Endpoint = import.meta.env.VITE_API_BASE_URL;
// 		const response = await fetch(`${API_Endpoint}/tracking/status/${trackingNumber}`);

// 		if (response.ok) {
// 			const data = await response.json();
// 			// Map API response to our internal status
// 			switch (data.status?.toLowerCase()) {
// 				case 'delivered':
// 				case 'completed':
// 				case 'success':
// 					return 'delivered'; // ใช้ 'delivered' ภายใน tracking
// 				case 'shipped':
// 				case 'in_transit':
// 				case 'out_for_delivery':
// 					return 'shipped';
// 				case 'exception':
// 				case 'failed':
// 				case 'returned':
// 				case 'error':
// 					return 'exception';
// 				case 'pending':
// 				case 'processing':
// 					return 'pending';
// 				default:
// 					return 'shipped'; // Default to shipped if tracking exists
// 			}
// 		}
// 	} catch (error) {
// 		console.error('Error fetching tracking status from API:', error);
// 	}

// 	// Fallback to sync method if API fails
// 	return getTrackingStatusSync(trackingNumber);
// }

// // Enhanced tracking status checker with common Thai postal patterns
// function getTrackingStatusSync(trackingNumber: string): 'pending' | 'shipped' | 'delivered' | 'exception' | null {
// 	if (!trackingNumber) return null;

// 	const upperTracking = trackingNumber.toUpperCase();
// 	const lowerTracking = trackingNumber.toLowerCase();

// 	// Check for delivered patterns (Thai and English)
// 	if (
// 		upperTracking.includes('DELIVERED') ||
// 		upperTracking.includes('DLV') ||
// 		upperTracking.includes('COMPLETED') ||
// 		upperTracking.includes('SUCCESS') ||
// 		lowerTracking.includes('delivered') ||
// 		lowerTracking.includes('จัดส่งสำเร็จ') ||
// 		lowerTracking.includes('ส่งสำเร็จ') ||
// 		lowerTracking.includes('delivered successfully')
// 	) {
// 		return 'delivered'; // ใช้ 'delivered' ภายใน tracking
// 	}

// 	// Check for exception patterns
// 	if (
// 		upperTracking.includes('EXCEPTION') ||
// 		upperTracking.includes('FAILED') ||
// 		upperTracking.includes('RETURNED') ||
// 		upperTracking.includes('ERROR') ||
// 		upperTracking.includes('REJECTED') ||
// 		lowerTracking.includes('exception') ||
// 		lowerTracking.includes('ไม่สามารถส่งได้') ||
// 		lowerTracking.includes('ส่งไม่สำเร็จ')
// 	) {
// 		return 'exception';
// 	}

// 	// Check for pending patterns
// 	if (
// 		upperTracking.includes('PENDING') ||
// 		upperTracking.includes('PROCESSING') ||
// 		upperTracking.includes('PREPARING') ||
// 		lowerTracking.includes('กำลังเตรียม') ||
// 		lowerTracking.includes('รอการจัดส่ง')
// 	) {
// 		return 'pending';
// 	}

// 	// Default to shipped if tracking number exists
// 	return 'shipped';
// }

// // Alternative method: Parse TrackingStatus component DOM to extract status
// function getTrackingStatusFromDOM(
// 	trackingNumber: string
// ): Promise<'pending' | 'shipped' | 'delivered' | 'exception' | null> {
// 	return new Promise((resolve) => {
// 		try {
// 			// Create a hidden container
// 			const tempContainer = document.createElement('div');
// 			tempContainer.style.position = 'absolute';
// 			tempContainer.style.left = '-9999px';
// 			tempContainer.style.top = '-9999px';
// 			tempContainer.style.visibility = 'hidden';
// 			tempContainer.style.pointerEvents = 'none';
// 			document.body.appendChild(tempContainer);

// 			// Import React and render TrackingStatus
// 			import('react')
// 				.then((React) => {
// 					import('react-dom/client')
// 						.then((ReactDOM) => {
// 							const trackingElement = React.createElement(TrackingStatus, {
// 								barcode: trackingNumber
// 							});

// 							const root = ReactDOM.createRoot(tempContainer);
// 							root.render(trackingElement);

// 							// Wait for component to render, then parse the DOM
// 							setTimeout(() => {
// 								try {
// 									const statusText = tempContainer.textContent?.toLowerCase() || '';

// 									// Parse the rendered content for status keywords
// 									if (
// 										statusText.includes('delivered') ||
// 										statusText.includes('completed') ||
// 										statusText.includes('success') ||
// 										statusText.includes('จัดส่งสำเร็จ') ||
// 										statusText.includes('ส่งสำเร็จ')
// 									) {
// 										resolve('delivered');
// 									} else if (
// 										statusText.includes('exception') ||
// 										statusText.includes('failed') ||
// 										statusText.includes('error') ||
// 										statusText.includes('returned') ||
// 										statusText.includes('ไม่สามารถส่งได้')
// 									) {
// 										resolve('exception');
// 									} else if (
// 										statusText.includes('shipped') ||
// 										statusText.includes('in transit') ||
// 										statusText.includes('out for delivery') ||
// 										statusText.includes('กำลังจัดส่ง')
// 									) {
// 										resolve('shipped');
// 									} else if (
// 										statusText.includes('pending') ||
// 										statusText.includes('processing') ||
// 										statusText.includes('กำลังเตรียม')
// 									) {
// 										resolve('pending');
// 									} else {
// 										resolve('shipped'); // Default fallback
// 									}
// 								} catch (parseError) {
// 									console.error('Error parsing tracking status from DOM:', parseError);
// 									resolve('shipped');
// 								} finally {
// 									// Cleanup
// 									if (document.body.contains(tempContainer)) {
// 										document.body.removeChild(tempContainer);
// 									}
// 								}
// 							}, 2000); // Wait 2 seconds for component to fully render
// 						})
// 						.catch(() => {
// 							document.body.removeChild(tempContainer);
// 							resolve('shipped');
// 						});
// 				})
// 				.catch(() => {
// 					document.body.removeChild(tempContainer);
// 					resolve('shipped');
// 				});
// 		} catch (error) {
// 			console.error('Error creating tracking status DOM check:', error);
// 			resolve('shipped');
// 		}
// 	});
// }

// // const paymentMethodIcons: Record<string, any> = {
// // 	bank_transfer: <BankIcon sx={{ fontSize: 18 }} />,
// // 	credit_card: <CreditCardIcon sx={{ fontSize: 18 }} />,
// // 	paypal: <PaymentIcon sx={{ fontSize: 18 }} />,
// // 	cash_on_delivery: <MoneyIcon sx={{ fontSize: 18 }} />,
// // 	check: <ReceiptIcon sx={{ fontSize: 18 }} />,
// // 	default: <PaymentIcon sx={{ fontSize: 18 }} />
// // };

// // // Helper function to get payment method icon
// // function getPaymentMethodIcon(paymentMethod: string) {
// // 	const method = paymentMethod.toLowerCase().replace(/[^a-z0-9]/g, '_');
// // 	return paymentMethodIcons[method] || paymentMethodIcons['default'];
// // }

// function OrdersTable() {
// 	// Use RTK Query hooks (these are already defined in your ECommerceApi)
// 	const { t } = useTranslation('EcommPage');
// 	const { data: orders, isLoading, error } = useGetOrdersFromNewApiQuery();
// 	const [deleteOrdersMutation, { isLoading: isDeleting }] = useDeleteOrdersFromNewApiMutation();
// 	const [updateTrackingMutation, { isLoading: isUpdatingTracking }] = useUpdateOrderTrackingMutation();
// 	const [trackingLoading, setTrackingLoading] = useState<boolean>(false);

// 	// Tracking dialog states
// 	const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
// 	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
// 	const [trackingNumber, setTrackingNumber] = useState('');
// 	const [snackbarOpen, setSnackbarOpen] = useState(false);
// 	const [snackbarMessage, setSnackbarMessage] = useState('');
// 	const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

// 	// Confirm payment dialog states
// 	const [confirmPaymentDialogOpen, setConfirmPaymentDialogOpen] = useState(false);
// 	const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

// 	// Mark as completed dialog states
// 	const [markCompletedDialogOpen, setMarkCompletedDialogOpen] = useState(false);
// 	const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);

// 	// Status filter states
// 	const [selectedStatus, setSelectedStatus] = useState<string>('all');
// 	const [filteredOrders, setFilteredOrders] = useState<OrderWithTrackingStatus[]>([]);

// 	// Process orders with tracking status - now with multiple checking methods
// 	const [ordersWithTrackingStatus, setOrdersWithTrackingStatus] = useState<OrderWithTrackingStatus[]>([]);

// 	// Update orders with tracking status when orders change
// 	useEffect(() => {
// 		const processOrdersWithTracking = async () => {
// 			if (!orders) {
// 				setOrdersWithTrackingStatus([]);
// 				return;
// 			}

// 			const processedOrders = await Promise.all(
// 				orders.map(async (order) => {
// 					let trackingStatus: 'pending' | 'shipped' | 'delivered' | 'exception' | null = null;

// 					// *** ADDED ***: If order status is already completed, don't bother checking tracking
// 					if (order.order_status.toLowerCase() === 'completed') {
// 						return {
// 							...order,
// 							trackingStatus: 'delivered' // or 'completed', 'delivered' matches tracking logic
// 						} as OrderWithTrackingStatus;
// 					}

// 					if (order.tracking_number) {
// 						// Method 1: Try API endpoint first (fastest)
// 						try {
// 							trackingStatus = await getTrackingStatusFromAPI(order.tracking_number);
// 						} catch (error) {
// 							console.log('API method failed, trying sync method');
// 						}

// 						// Method 2: If API fails, use sync pattern matching
// 						if (!trackingStatus || trackingStatus === 'shipped') {
// 							const syncStatus = getTrackingStatusSync(order.tracking_number);

// 							if (syncStatus && syncStatus !== 'shipped') {
// 								trackingStatus = syncStatus;
// 							}
// 						}

// 						// Default fallback
// 						if (!trackingStatus) {
// 							trackingStatus = 'shipped';
// 						}
// 					}

// 					return {
// 						...order,
// 						trackingStatus
// 					} as OrderWithTrackingStatus;
// 				})
// 			);

// 			setOrdersWithTrackingStatus(processedOrders);
// 		};

// 		processOrdersWithTracking();
// 	}, [orders]);

// 	// Add a refresh function to manually update tracking status
// 	const refreshTrackingStatus = async () => {
// 		if (!orders) return;

// 		const processedOrders = await Promise.all(
// 			orders.map(async (order) => {
// 				let trackingStatus: 'pending' | 'shipped' | 'delivered' | 'exception' | null = null;

// 				// *** ADDED ***: If order status is already completed, don't bother checking tracking
// 				if (order.order_status.toLowerCase() === 'completed') {
// 					return {
// 						...order,
// 						trackingStatus: 'delivered' // or 'completed'
// 					} as OrderWithTrackingStatus;
// 				}

// 				if (order.tracking_number) {
// 					// Force refresh by trying DOM parsing method
// 					try {
// 						trackingStatus = await getTrackingStatusFromDOM(order.tracking_number);
// 					} catch (error) {
// 						trackingStatus = getTrackingStatusSync(order.tracking_number);
// 					}
// 				}

// 				return {
// 					...order,
// 					trackingStatus
// 				} as OrderWithTrackingStatus;
// 			})
// 		);

// 		setOrdersWithTrackingStatus(processedOrders);
// 		setSnackbarMessage('Tracking status refreshed successfully');
// 		setSnackbarSeverity('success');
// 		setSnackbarOpen(true);
// 	};

// 	// Helper function to get effective order category based on tracking status
// 	const getEffectiveCategory = (order: OrderWithTrackingStatus): string => {
// 		// ✅ *** MODIFIED ***: Prioritize 'completed' or 'delivered' from order_status first
// 		const lowerOrderStatus = order.order_status.toLowerCase();

// 		if (lowerOrderStatus === 'completed' || lowerOrderStatus === 'delivered') {
// 			return 'completed';
// 		}

// 		// If order has tracking number and is delivered, categorize as completed
// 		if (order.tracking_number && order.trackingStatus === 'delivered') {
// 			return 'completed';
// 		}

// 		// If order has tracking number and is shipped (but not delivered), categorize as shipped
// 		if (order.tracking_number && (order.trackingStatus === 'shipped' || order.trackingStatus === 'pending')) {
// 			return 'shipped';
// 		}

// 		// If order has tracking number but has exception, keep original category
// 		if (order.tracking_number && order.trackingStatus === 'exception') {
// 			// Check original status category
// 			const config = statusConfig[order.order_status];
// 			return config?.category || 'error';
// 		}

// 		// Use original status config
// 		const config = statusConfig[order.order_status];

// 		if (config?.category) {
// 			return config.category;
// 		}

// 		// Fallback categorization
// 		// const status = order.order_status.toLowerCase(); // Already defined as lowerOrderStatus
// 		if (
// 			lowerOrderStatus.includes('pending') ||
// 			lowerOrderStatus.includes('awaiting') ||
// 			lowerOrderStatus.includes('waiting')
// 		) {
// 			return 'pending';
// 		} else if (
// 			lowerOrderStatus.includes('processing') ||
// 			lowerOrderStatus.includes('preparing') ||
// 			lowerOrderStatus.includes('accepted')
// 		) {
// 			return 'processing';
// 		} else if (lowerOrderStatus.includes('shipped') || lowerOrderStatus.includes('shipping')) {
// 			return 'shipped';
// 		} else if (lowerOrderStatus.includes('cancel') || lowerOrderStatus.includes('refund')) {
// 			return 'canceled';
// 		} else if (lowerOrderStatus.includes('error') || lowerOrderStatus.includes('failed')) {
// 			return 'error';
// 		}

// 		return 'unknown';
// 	};

// 	// Helper function to check if order can be marked as completed
// 	const canMarkAsCompleted = (orderStatus: string, trackingNumber?: string, currentTrackingStatus?: string) => {
// 		// Only allow if order has tracking number and is not already completed
// 		if (!trackingNumber || !trackingNumber.trim()) {
// 			return false;
// 		}

// 		const normalizedStatus = orderStatus.toLowerCase(); // ✅ Moved up

// 		// ✅ *** MODIFIED ***: Don't show if already completed/delivered
// 		if (
// 			currentTrackingStatus === 'delivered' ||
// 			normalizedStatus === 'completed' ||
// 			normalizedStatus === 'delivered'
// 		) {
// 			return false;
// 		}

// 		// Allow for shipped orders or orders that are being processed
// 		return (
// 			normalizedStatus.includes('shipped') ||
// 			normalizedStatus.includes('preparing') ||
// 			normalizedStatus === 'payment accepted' ||
// 			normalizedStatus === 'paid' ||
// 			normalizedStatus === 'remote payment accepted' ||
// 			currentTrackingStatus === 'shipped' ||
// 			currentTrackingStatus === 'pending'
// 		);
// 	};

// 	// Helper function to check if order can confirm payment
// 	const canConfirmPayment = (orderStatus: string, trackingNumber?: string) => {
// 		// ถ้ามี tracking number แล้ว ไม่ให้กดปุ่ม Confirm Payment
// 		if (trackingNumber && trackingNumber.trim() !== '') {
// 			return false;
// 		}

// 		const normalizedStatus = orderStatus.toLowerCase();
// 		return (
// 			normalizedStatus === 'payment accepted' ||
// 			normalizedStatus === 'paid' ||
// 			normalizedStatus === 'remote payment accepted'
// 		);
// 	};

// 	const columns = useMemo<MRT_ColumnDef<OrderWithTrackingStatus>[]>(
// 		() => [
// 			{
// 				accessorKey: 'invoice_no',
// 				header: t('Invoice No.'),
// 				size: 140,
// 				Cell: ({ row }) => (
// 					<Typography
// 						component={Link}
// 						to={`/apps/e-commerce/orders/${row.original.order_id}`}
// 						role='button'
// 					>
// 						<u>{row.original.invoice_no}</u>
// 					</Typography>
// 				)
// 			},
// 			{
// 				accessorKey: 'tracking_number',
// 				header: t('Tracking'),
// 				size: 140,
// 				Cell: ({ row }) => {
// 					const hasTracking = row.original.tracking_number;
// 					const trackingStatus = row.original.trackingStatus;

// 					return (
// 						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
// 							<Typography
// 								sx={{
// 									fontFamily: 'monospace',
// 									fontSize: '1.5rem',
// 									fontWeight: hasTracking ? 600 : 400,
// 									color: hasTracking ? '#2e7d32' : '#757575',
// 									px: 1.5,
// 									py: 0.75
// 								}}
// 							>
// 								{row.original.tracking_number || t('Not assigned')}
// 							</Typography>
// 						</Box>
// 					);
// 				}
// 			},
// 			{
// 				accessorFn: (row) => `${row.first_name} ${row.last_name}`,
// 				header: t('Customer Name'),
// 				size: 100,
// 				Cell: ({ cell }) => (
// 					<Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>{cell.getValue<string>()}</Typography>
// 				),
// 				id: 'full_name' // ใส่ id เพื่อใช้เป็น unique key
// 			},
// 			{
// 				accessorKey: 'total_amount',
// 				header: t('Total Amount'),
// 				size: 120,
// 				Cell: ({ row }) => (
// 					<Typography
// 						sx={{
// 							fontWeight: 600,
// 							fontSize: '1.5rem',
// 							color: '#1976d2'
// 						}}
// 					>
// 						฿{' '}
// 						{parseFloat(row.original.total_amount).toLocaleString('th-TH', {
// 							minimumFractionDigits: 2,
// 							maximumFractionDigits: 2
// 						})}
// 					</Typography>
// 				)
// 			},
// 			{
// 				accessorKey: 'payment_method',
// 				header: t('Payment Method'),
// 				size: 140,
// 				Cell: ({ row }) => (
// 					<div style={{ display: 'flex', alignItems: 'center' }}>
// 						<CreditCardIcon />
// 						<Typography
// 							sx={{
// 								textTransform: 'capitalize',
// 								fontWeight: 500,
// 								fontSize: '1.5rem',
// 								px: 1.5,
// 								py: 0.75
// 							}}
// 						>
// 							{row.original.payment_method}
// 						</Typography>
// 					</div>
// 				)
// 			},
// 			{
// 				accessorKey: 'order_status',
// 				header: t('Status'),
// 				size: 160,
// 				Cell: ({ row }) => {
// 					const status = row.original.order_status;
// 					const effectiveCategory = getEffectiveCategory(row.original);
// 					const hasTracking = row.original.tracking_number;
// 					const trackingStatus = row.original.trackingStatus;

// 					console.log('Status from data:', status); // Debug log

// 					// ✅ *** MODIFIED ***: ใช้ config จาก statusConfig หรือ config 'completed' ที่สร้างขึ้นใหม่
// 					const config =
// 						statusConfig[status] ||
// 						(status.toLowerCase() === 'completed' ? statusConfig['Completed'] : null);
// 					console.log('Config found:', config); // Debug log

// 					// Determine display status and config based on tracking status
// 					let displayStatus = status;
// 					let finalConfig = config;

// 					// ✅ *** MODIFIED ***: Prioritize 'completed'/'delivered' from database status FIRST
// 					const lowerStatus = status.toLowerCase();

// 					if (lowerStatus === 'completed' || lowerStatus === 'delivered') {
// 						displayStatus = 'Completed';
// 						finalConfig = {
// 							color: '#1b5e20',
// 							bgColor: alpha('#1b5e20', 0.1),
// 							icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
// 							category: 'completed'
// 						};
// 					}
// 					// Then, check tracking status
// 					else if (hasTracking && trackingStatus === 'delivered') {
// 						displayStatus = 'Completed'; // Changed from 'Delivered' to 'Completed'
// 						finalConfig = {
// 							color: '#1b5e20',
// 							bgColor: alpha('#1b5e20', 0.1),
// 							icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
// 							category: 'completed'
// 						};
// 					} else if (hasTracking && (trackingStatus === 'shipped' || trackingStatus === 'pending')) {
// 						displayStatus = 'Shipped';
// 						finalConfig = {
// 							color: '#9c27b0',
// 							bgColor: alpha('#9c27b0', 0.1),
// 							icon: <TrackingIcon sx={{ fontSize: 20 }} />,
// 							category: 'shipped'
// 						};
// 					} else if (hasTracking && trackingStatus === 'exception') {
// 						displayStatus = 'Delivery Exception';
// 						finalConfig = {
// 							color: '#d32f2f',
// 							bgColor: alpha('#d32f2f', 0.1),
// 							icon: <ErrorIcon sx={{ fontSize: 20 }} />,
// 							category: 'error'
// 						};
// 					}

// 					// Fallback config if not found
// 					if (!finalConfig) {
// 						// Handle common status patterns
// 						// const lowerStatus = status.toLowerCase(); // Defined above

// 						if (lowerStatus === 'paid' || lowerStatus.includes('paid')) {
// 							finalConfig = {
// 								color: '#2e7d32',
// 								bgColor: alpha('#2e7d32', 0.1),
// 								icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
// 								category: 'processing'
// 							};
// 						} else if (lowerStatus.includes('pending') || lowerStatus.includes('waiting')) {
// 							finalConfig = {
// 								color: '#1976d2',
// 								bgColor: alpha('#1976d2', 0.1),
// 								icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
// 								category: 'pending'
// 							};
// 						} else if (lowerStatus.includes('cancel') || lowerStatus.includes('refund')) {
// 							finalConfig = {
// 								color: '#d32f2f',
// 								bgColor: alpha('#d32f2f', 0.1),
// 								icon: <CancelIcon sx={{ fontSize: 20 }} />,
// 								category: 'canceled'
// 							};
// 						} else {
// 							// Default fallback
// 							finalConfig = {
// 								color: '#757575',
// 								bgColor: alpha('#757575', 0.1),
// 								icon: <PendingIcon sx={{ fontSize: 20 }} />,
// 								category: 'unknown'
// 							};
// 						}
// 					}

// 					console.log('Final config:', finalConfig); // Debug log

// 					return (
// 						<Box
// 							sx={{
// 								display: 'inline-flex',
// 								alignItems: 'center',
// 								gap: 1,
// 								px: 2.5,
// 								py: 1,
// 								borderRadius: '16px',
// 								backgroundColor: finalConfig.bgColor,
// 								color: finalConfig.color,
// 								border: `1px solid ${finalConfig.color}`,
// 								fontWeight: 600,
// 								fontSize: '1.5rem',
// 								minHeight: '32px'
// 							}}
// 						>
// 							{finalConfig.icon}
// 							<Typography
// 								variant='body2'
// 								sx={{
// 									fontWeight: 600,
// 									fontSize: '1.5rem',
// 									color: 'inherit'
// 								}}
// 							>
// 								{displayStatus}
// 							</Typography>
// 						</Box>
// 					);
// 				}
// 			},
// 			{
// 				accessorKey: 'created_at',
// 				header: t('Created Date'),
// 				size: 160,
// 				Cell: ({ row }) => (
// 					<Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
// 						{new Date(row.original.created_at).toLocaleDateString('en-US', {
// 							year: 'numeric',
// 							month: 'short',
// 							day: 'numeric',
// 							hour: '2-digit',
// 							minute: '2-digit'
// 						})}
// 					</Typography>
// 				)
// 			}
// 		],
// 		[]
// 	);

// 	const handleDeleteOrder = async (orderId: number) => {
// 		try {
// 			await deleteOrdersMutation([orderId]).unwrap();
// 			setSnackbarMessage('Order deleted successfully');
// 			setSnackbarSeverity('success');
// 			setSnackbarOpen(true);
// 		} catch (error) {
// 			console.error('Failed to delete order:', error);
// 			setSnackbarMessage('Failed to delete order');
// 			setSnackbarSeverity('error');
// 			setSnackbarOpen(true);
// 		}
// 	};

// 	const handleDeleteSelectedOrders = async (selectedRows: any[]) => {
// 		try {
// 			const orderIds = selectedRows.map((row) => row.original.order_id);
// 			await deleteOrdersMutation(orderIds).unwrap();
// 			setSnackbarMessage('Orders deleted successfully');
// 			setSnackbarSeverity('success');
// 			setSnackbarOpen(true);
// 		} catch (error) {
// 			console.error('Failed to delete orders:', error);
// 			setSnackbarMessage('Failed to delete orders');
// 			setSnackbarSeverity('error');
// 			setSnackbarOpen(true);
// 		}
// 	};

// 	// Tracking number handlers
// 	const handleOpenTrackingDialog = (order: Order) => {
// 		setSelectedOrder(order);
// 		setTrackingNumber(order.tracking_number || '');
// 		setTrackingDialogOpen(true);
// 	};

// 	const handleCloseTrackingDialog = () => {
// 		setTrackingDialogOpen(false);
// 		setSelectedOrder(null);
// 		setTrackingNumber('');
// 	};

// 	const handleUpdateTracking = async () => {
// 		if (!selectedOrder) return;

// 		setTrackingLoading(true);
// 		try {
// 			const API_Endpoint = import.meta.env.VITE_API_BASE_URL;
// 			await updateTrackingMutation({
// 				orderId: selectedOrder.order_id,
// 				tracking_number: trackingNumber
// 			}).unwrap();

// 			await fetch(`${API_Endpoint}/order/orderTransaction`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify(selectedOrder) // แปลง object เป็น JSON string ก่อนส่ง
// 			});

// 			setSnackbarMessage('Tracking number updated successfully');
// 			setSnackbarSeverity('success');
// 			setSnackbarOpen(true);
// 			handleCloseTrackingDialog();
// 			setTrackingLoading(false);
// 		} catch (error) {
// 			console.error('Failed to update tracking number:', error);
// 			setSnackbarMessage('Failed to update tracking number');
// 			setSnackbarSeverity('error');
// 			setSnackbarOpen(true);
// 		}
// 	};

// 	// Confirm payment handlers
// 	const handleOpenConfirmPaymentDialog = (order: Order) => {
// 		setSelectedOrder(order);
// 		setConfirmPaymentDialogOpen(true);
// 	};

// 	const handleCloseConfirmPaymentDialog = () => {
// 		setConfirmPaymentDialogOpen(false);
// 		setSelectedOrder(null);
// 	};

// 	const handleConfirmPayment = async () => {
// 		if (!selectedOrder) return;

// 		setIsConfirmingPayment(true);
// 		try {
// 			const API_Endpoint = import.meta.env.VITE_API_BASE_URL;
// 			await updateTrackingMutation({
// 				orderId: selectedOrder.order_id,
// 				tracking_number: trackingNumber
// 			}).unwrap();

// 			await fetch(`${API_Endpoint}/order/orderTransaction`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify(selectedOrder) // แปลง object เป็น JSON string ก่อนส่ง
// 			});

// 			setSnackbarMessage('Payment confirmation email sent successfully');
// 			setSnackbarSeverity('success');
// 			setSnackbarOpen(true);
// 			handleCloseConfirmPaymentDialog();
// 		} catch (error) {
// 			console.error('Failed to confirm payment:', error);
// 			setSnackbarMessage('Failed to send confirmation email');
// 			setSnackbarSeverity('error');
// 			setSnackbarOpen(true);
// 		} finally {
// 			setIsConfirmingPayment(false);
// 		}
// 	};

// 	// Mark as completed handlers
// 	const handleOpenMarkCompletedDialog = (order: Order) => {
// 		setSelectedOrder(order);
// 		setMarkCompletedDialogOpen(true);
// 	};

// 	const handleCloseMarkCompletedDialog = () => {
// 		setMarkCompletedDialogOpen(false);
// 		setSelectedOrder(null);
// 	};

// 	// const handleMarkAsCompleted = async () => {
// 	// 	if (!selectedOrder) return;

// 	// 	setIsMarkingCompleted(true);
// 	// 	try {
// 	// 		const API_Endpoint = import.meta.env.VITE_API_BASE_URL;

// 	// 		// Update the order status to completed in the backend
// 	// 		await fetch(`${API_Endpoint}/order/updateStatus`, {
// 	// 			method: 'POST',
// 	// 			headers: { 'Content-Type': 'application/json' },
// 	// 			body: JSON.stringify({
// 	// 				orderId: selectedOrder.order_id,
// 	// 				status: 'Delivered', // or 'Completed' depending on your backend
// 	// 				trackingStatus: 'delivered'
// 	// 			})
// 	// 		});

// 	// 		// Also trigger the order transaction endpoint
// 	// 		await fetch(`${API_Endpoint}/order/orderTransaction`, {
// 	// 			method: 'POST',
// 	// 			headers: { 'Content-Type': 'application/json' },
// 	// 			body: JSON.stringify({
// 	// 				...selectedOrder,
// 	// 				order_status: 'Delivered',
// 	// 				trackingStatus: 'delivered'
// 	// 			})
// 	// 		});

// 	// 		// Update local state to reflect the change immediately
// 	// 		setOrdersWithTrackingStatus((prevOrders) =>
// 	// 			prevOrders.map((order) =>
// 	// 				order.order_id === selectedOrder.order_id
// 	// 					? { ...order, order_status: 'Delivered', trackingStatus: 'delivered' as const }
// 	// 					: order
// 	// 			)
// 	// 		);

// 	// 		setSnackbarMessage('Order marked as completed successfully');
// 	// 		setSnackbarSeverity('success');
// 	// 		setSnackbarOpen(true);
// 	// 		handleCloseMarkCompletedDialog();
// 	// 	} catch (error) {
// 	// 		console.error('Failed to mark order as completed:', error);
// 	// 		setSnackbarMessage('Failed to mark order as completed');
// 	// 		setSnackbarSeverity('error');
// 	// 		setSnackbarOpen(true);
// 	// 	} finally {
// 	// 		setIsMarkingCompleted(false);
// 	// 	}
// 	// };

// 	const handleMarkAsCompleted = async () => {
// 		if (!selectedOrder) return;

// 		setIsMarkingCompleted(true);
// 		try {
// 			const API_Endpoint = import.meta.env.VITE_API_BASE_URL;

// 			// ✅ PATCH /order/status/:invoiceNo
// 			const res = await fetch(`${API_Endpoint}/order/updateStatus`, {
// 				method: 'PATCH',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					invoice_no: selectedOrder.invoice_no,
// 					order_status: 'completed', // ส่ง 'completed' ตามที่ API ต้องการ
// 					tracking_number: selectedOrder.tracking_number || null,
// 					notes: 'Order marked as completed'
// 				})
// 			});

// 			if (!res.ok) throw new Error('Failed to update order status');

// 			// ✅ optional: call transaction API if needed
// 			await fetch(`${API_Endpoint}/order/orderTransaction`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					...selectedOrder,
// 					order_status: 'completed', // ✅ *** MODIFIED ***
// 					tracking_status: 'completed' // ✅ *** MODIFIED ***
// 				})
// 			});

// 			// ✅ update local UI state
// 			setOrdersWithTrackingStatus((prevOrders) =>
// 				prevOrders.map((order) =>
// 					order.order_id === selectedOrder.order_id
// 						? {
// 								...order,
// 								order_status: 'completed',
// 								trackingStatus: 'delivered' as const // ✅ *** MODIFIED ***
// 							}
// 						: order
// 				)
// 			);

// 			setSnackbarMessage('Order marked as completed successfully');
// 			setSnackbarSeverity('success');
// 		} catch (error) {
// 			console.error('Failed to mark order as completed:', error);
// 			setSnackbarMessage('Failed to mark order as completed');
// 			setSnackbarSeverity('error');
// 		} finally {
// 			setSnackbarOpen(true);
// 			handleCloseMarkCompletedDialog();
// 			setIsMarkingCompleted(false);
// 		}
// 	};

// 	const handleCloseSnackbar = () => {
// 		setSnackbarOpen(false);
// 	};

// 	// Filter orders based on selected status
// 	useEffect(() => {
// 		if (!ordersWithTrackingStatus) {
// 			setFilteredOrders([]);
// 			return;
// 		}

// 		console.log(`Filtering orders for status: "${selectedStatus}"`);

// 		if (selectedStatus === 'all') {
// 			setFilteredOrders(ordersWithTrackingStatus);
// 		} else {
// 			const filtered = ordersWithTrackingStatus.filter((order) => {
// 				const effectiveCategory = getEffectiveCategory(order);
// 				const matches = effectiveCategory === selectedStatus;

// 				console.log(
// 					`Order ${order.order_id}: status="${order.order_status}", tracking="${order.tracking_number}", trackingStatus="${order.trackingStatus}", effectiveCategory="${effectiveCategory}", matches="${matches}"`
// 				);

// 				return matches;
// 			});

// 			console.log(`Filtered ${filtered.length} orders from ${ordersWithTrackingStatus.length} total`);
// 			setFilteredOrders(filtered);
// 		}
// 	}, [ordersWithTrackingStatus, selectedStatus]);

// 	// Calculate status counts
// 	const useMemoizedStatusCounts = () =>
// 		useMemo(() => {
// 			if (!ordersWithTrackingStatus) return {};

// 			const counts: Record<string, number> = {
// 				all: ordersWithTrackingStatus.length,
// 				pending: 0,
// 				processing: 0,
// 				shipped: 0,
// 				completed: 0,
// 				canceled: 0,
// 				error: 0
// 			};

// 			// Debug: Log unique statuses to see what we're getting from API
// 			const uniqueStatuses = [...new Set(ordersWithTrackingStatus.map((order) => order.order_status))];
// 			console.log('Unique order statuses from API:', uniqueStatuses);

// 			ordersWithTrackingStatus.forEach((order) => {
// 				const effectiveCategory = getEffectiveCategory(order);
// 				console.log(
// 					`Order ${order.order_id}: status="${order.order_status}", effectiveCategory="${effectiveCategory}"`
// 				);

// 				if (effectiveCategory && counts.hasOwnProperty(effectiveCategory)) {
// 					counts[effectiveCategory] += 1;
// 				} else {
// 					console.warn(`Unmatched effective category: "${effectiveCategory}" for order ${order.order_id}`);
// 				}
// 			});

// 			console.log('Final counts:', counts);
// 			return counts;
// 		}, [ordersWithTrackingStatus]);

// 	const statusCounts = useMemoizedStatusCounts(); // ใช้ useMemoizedStatusCounts

// 	// Status filter options
// 	const statusFilters = [
// 		{
// 			key: 'all',
// 			label: t('All Orders'),
// 			icon: <TrendingUpIcon sx={{ fontSize: 16 }} />,
// 			color: '#757575',
// 			bgColor: alpha('#757575', 0.1)
// 		},
// 		{
// 			key: 'pending',
// 			label: t('Pending'),
// 			icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
// 			color: '#1976d2',
// 			bgColor: alpha('#1976d2', 0.1)
// 		},
// 		{
// 			key: 'processing',
// 			label: t('Processing'),
// 			icon: <PendingIcon sx={{ fontSize: 16 }} />,
// 			color: '#ed6c02',
// 			bgColor: alpha('#ed6c02', 0.1)
// 		},
// 		{
// 			key: 'shipped',
// 			label: t('Shipped'),
// 			icon: <TrackingIcon sx={{ fontSize: 16 }} />,
// 			color: '#9c27b0',
// 			bgColor: alpha('#9c27b0', 0.1)
// 		},
// 		{
// 			key: 'completed',
// 			label: t('Completed'),
// 			icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
// 			color: '#2e7d32',
// 			bgColor: alpha('#2e7d32', 0.1)
// 		},
// 		{
// 			key: 'canceled',
// 			label: t('Canceled/Refunded'),
// 			icon: <CancelIcon sx={{ fontSize: 16 }} />,
// 			color: '#d32f2f',
// 			bgColor: alpha('#d32f2f', 0.1)
// 		},
// 		{
// 			key: 'error',
// 			label: t('Payment Error'),
// 			icon: <ErrorIcon sx={{ fontSize: 16 }} />,
// 			color: '#b71c1c',
// 			bgColor: alpha('#b71c1c', 0.1)
// 		}
// 	];

// 	if (isLoading) {
// 		return <FuseLoading />;
// 	}

// 	if (error) {
// 		return (
// 			<Paper className='flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-0 w-full h-full p-24'>
// 				<Typography color='error'>
// 					Error loading orders: {error instanceof Error ? error.message : 'Unknown error'}
// 				</Typography>
// 			</Paper>
// 		);
// 	}

// 	return (
// 		<Box sx={{ width: '100%', height: '100%' }}>
// 			{/* Orders Table with Integrated Status Overview */}
// 			<Paper
// 				className='flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-0 w-full h-full'
// 				elevation={0}
// 				sx={{ borderRadius: '16px', overflow: 'hidden' }}
// 			>
// 				<DataTable
// 					initialState={{
// 						density: 'spacious',
// 						showColumnFilters: false,
// 						showGlobalFilter: true,
// 						columnPinning: {
// 							left: ['mrt-row-expand', 'mrt-row-select'],
// 							right: ['mrt-row-actions']
// 						},
// 						pagination: {
// 							pageIndex: 0,
// 							pageSize: 10
// 						},
// 						sorting: [
// 							{
// 								id: 'created_at',
// 								desc: true
// 							}
// 						]
// 					}}
// 					data={filteredOrders || []}
// 					columns={columns}
// 					renderRowActionMenuItems={({ closeMenu, row, table }) => [
// 						// Mark as Completed Menu Item (only show for eligible orders)
// 						...(canMarkAsCompleted(
// 							row.original.order_status,
// 							row.original.tracking_number,
// 							row.original.trackingStatus
// 						)
// 							? [
// 									{
// 										key: 'markCompleted',
// 										component: (
// 											<MenuItem
// 												key='markCompleted'
// 												onClick={() => {
// 													handleOpenMarkCompletedDialog(row.original);
// 													closeMenu();
// 												}}
// 												disabled={isMarkingCompleted}
// 												sx={{
// 													color: '#1b5e20',
// 													'&:hover': {
// 														backgroundColor: alpha('#1b5e20', 0.1)
// 													}
// 												}}
// 											>
// 												<ListItemIcon>
// 													<CheckCircleIcon sx={{ color: '#1b5e20' }} />
// 												</ListItemIcon>
// 												{t('Mark as Completed')}
// 											</MenuItem>
// 										)
// 									}
// 								]
// 							: []
// 						).map((item) => item.component),
// 						// Confirm Payment Menu Item (only show for eligible orders)
// 						...(canConfirmPayment(row.original.order_status, row.original.tracking_number)
// 							? [
// 									{
// 										key: 'confirmPayment',
// 										component: (
// 											<MenuItem
// 												key='confirmPayment'
// 												onClick={() => {
// 													handleOpenConfirmPaymentDialog(row.original);
// 													closeMenu();
// 												}}
// 												disabled={isConfirmingPayment}
// 												sx={{
// 													color: '#2e7d32',
// 													'&:hover': {
// 														backgroundColor: alpha('#2e7d32', 0.1)
// 													}
// 												}}
// 											>
// 												<ListItemIcon>
// 													<ConfirmIcon sx={{ color: '#2e7d32' }} />
// 												</ListItemIcon>
// 												{t('Confirm Payment')}
// 											</MenuItem>
// 										)
// 									}
// 								]
// 							: []
// 						).map((item) => item.component),
// 						// Update Tracking Menu Item (only show if tracking_status is not cancelled)
// 						...(row.original.order_status !== 'cancelled' &&
// 						row.original.order_status !== 'completed' &&
// 						row.original.order_status !== 'delivered' // ✅ Don't show for completed
// 							? [
// 									<MenuItem
// 										key='tracking'
// 										onClick={() => {
// 											handleOpenTrackingDialog(row.original);
// 											closeMenu();
// 										}}
// 										disabled={isUpdatingTracking}
// 									>
// 										<ListItemIcon>
// 											<TrackingIcon />
// 										</ListItemIcon>
// 										{t('Update Tracking')}
// 									</MenuItem>
// 								]
// 							: []),
// 						// <MenuItem
// 						// 	key='delete'
// 						// 	onClick={async () => {
// 						// 		await handleDeleteOrder(row.original.order_id);
// 						// 		closeMenu();
// 						// 		table.resetRowSelection();
// 						// 	}}
// 						// 	disabled={isDeleting}
// 						// >
// 						// 	<ListItemIcon>
// 						// 		<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
// 						// 	</ListItemIcon>
// 						// 	Delete
// 						// </MenuItem>
// 					]}
// 					renderTopToolbarCustomActions={({ table }) => {
// 						const { rowSelection } = table.getState();

// 						return (
// 							<Box
// 								sx={{
// 									display: 'flex',
// 									alignItems: 'center',
// 									gap: 2,
// 									flexWrap: 'wrap',
// 									width: '100%',
// 									pt: 2,
// 									pb: 1
// 								}}
// 							>
// 								{/* Status Filter Pills */}
// 								<Box
// 									sx={{
// 										display: 'flex',
// 										gap: 1,
// 										flexWrap: 'nowrap',
// 										overflowX: 'auto',
// 										scrollbarWidth: 'thin',
// 										'&::-webkit-scrollbar': {
// 											height: '4px'
// 										},
// 										'&::-webkit-scrollbar-track': {
// 											background: '#f1f1f1',
// 											borderRadius: '4px'
// 										},
// 										'&::-webkit-scrollbar-thumb': {
// 											background: '#c1c1c1',
// 											borderRadius: '4px'
// 										},
// 										'&::-webkit-scrollbar-thumb:hover': {
// 											background: '#a8a8a8'
// 										},
// 										pb: 1,
// 										minWidth: 0,
// 										flex: 1
// 									}}
// 								>
// 									{statusFilters.map((filter) => (
// 										<Chip
// 											key={filter.key}
// 											icon={filter.icon}
// 											label={`${filter.label} (${statusCounts[filter.key] || 0})`}
// 											onClick={() => setSelectedStatus(filter.key)}
// 											sx={{
// 												cursor: 'pointer',
// 												transition: 'all 0.2s ease-in-out',
// 												backgroundColor:
// 													selectedStatus === filter.key ? filter.color : '#f5f5f5',
// 												color: selectedStatus === filter.key ? '#fff' : filter.color,
// 												border: `1px solid ${selectedStatus === filter.key ? filter.color : '#e0e0e0'}`,
// 												fontWeight: selectedStatus === filter.key ? 600 : 500,
// 												fontSize: '0.875rem',
// 												height: '36px',
// 												whiteSpace: 'nowrap',
// 												minWidth: 'fit-content',
// 												'&:hover': {
// 													backgroundColor:
// 														selectedStatus === filter.key ? filter.color : filter.bgColor,
// 													borderColor: filter.color,
// 													transform: 'translateY(-1px)',
// 													boxShadow: `0 2px 8px ${alpha(filter.color, 0.3)}`
// 												},
// 												'& .MuiChip-icon': {
// 													color: selectedStatus === filter.key ? '#fff' : filter.color,
// 													fontSize: '16px'
// 												}
// 											}}
// 										/>
// 									))}
// 								</Box>

// 								{/* Refresh Tracking Status Button */}
// 								{/* <Button
// 									variant='outlined'
// 									size='small'
// 									onClick={refreshTrackingStatus}
// 									sx={{
// 										minWidth: '140px',
// 										borderRadius: '8px',
// 										textTransform: 'none',
// 										fontWeight: 600,
// 										borderColor: '#1976d2',
// 										color: '#1976d2',
// 										'&:hover': {
// 											borderColor: '#1565c0',
// 											backgroundColor: alpha('#1976d2', 0.1)
// 										}
// 									}}
// 									startIcon={<TrackingIcon sx={{ fontSize: 16 }} />}
// 								>
// 									Refresh Status
// 								</Button> */}

// 								{/* Delete Selected Button */}
// 								{/* {Object.keys(rowSelection).length > 0 && (
// 									<Button
// 										variant='contained'
// 										size='small'
// 										onClick={async () => {
// 											const selectedRows = table.getSelectedRowModel().rows;
// 											await handleDeleteSelectedOrders(selectedRows);
// 											table.resetRowSelection();
// 										}}
// 										sx={{
// 											minWidth: '160px',
// 											borderRadius: '8px',
// 											textTransform: 'none',
// 											fontWeight: 600,
// 											ml: 'auto'
// 										}}
// 										color='secondary'
// 										disabled={isDeleting}
// 										startIcon={<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>}
// 									>
// 										{isDeleting
// 											? 'Deleting...'
// 											: `Delete ${Object.keys(rowSelection).length} items`}
// 									</Button>
// 								)} */}
// 							</Box>
// 						);
// 					}}
// 				/>

// 				{/* Tracking Number Dialog */}
// 				<Dialog
// 					open={trackingDialogOpen}
// 					onClose={handleCloseTrackingDialog}
// 					maxWidth='sm'
// 					fullWidth
// 					PaperProps={{
// 						sx: {
// 							borderRadius: '16px',
// 							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
// 						}
// 					}}
// 				>
// 					<DialogTitle
// 						sx={{
// 							background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
// 							color: 'white',
// 							fontWeight: 'bold',
// 							py: 3,
// 							textAlign: 'center',
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'center',
// 							gap: 2,
// 							position: 'relative'
// 						}}
// 					>
// 						<TrackingIcon sx={{ fontSize: 28 }} />
// 						{t('Update Tracking Number')}
// 						<IconButton
// 							onClick={handleCloseTrackingDialog}
// 							sx={{
// 								position: 'absolute',
// 								right: 8,
// 								top: '50%',
// 								transform: 'translateY(-50%)',
// 								color: 'white',
// 								'&:hover': {
// 									backgroundColor: 'rgba(255, 255, 255, 0.1)'
// 								}
// 							}}
// 						>
// 							<CloseIcon />
// 						</IconButton>
// 					</DialogTitle>
// 					<DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
// 						{selectedOrder && (
// 							<>
// 								<Typography
// 									variant='h6'
// 									sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
// 								>
// 									{t('Order')} #{selectedOrder.invoice_no}
// 								</Typography>
// 								<Typography
// 									variant='body2'
// 									color='text.secondary'
// 									sx={{ mb: 3, lineHeight: 1.6 }}
// 								>
// 									{t('Enter or update the tracking number for this order. This will help customers track their shipment and automatically update the order status to "Shipped".')}
// 								</Typography>
// 								<TextField
// 									label={t('Tracking Number')}
// 									fullWidth
// 									value={trackingNumber}
// 									onChange={(e) => setTrackingNumber(e.target.value)}
// 									placeholder={t('Enter tracking number (e.g., TH123456789)')}
// 									sx={{
// 										'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
// 											borderColor: '#1976d2'
// 										},
// 										'& .MuiInputLabel-root.Mui-focused': {
// 											color: '#1976d2'
// 										}
// 									}}
// 									helperText={t('Leave empty to remove tracking number')}
// 								/>

// 								{/* Show tracking status preview if tracking number exists */}
// 								{selectedOrder.tracking_number && (
// 									<Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
// 										<Typography
// 											variant='subtitle2'
// 											sx={{ mb: 1, fontWeight: 600 }}
// 										>
// 											{t('Current Tracking Status:')}
// 										</Typography>
// 										<TrackingStatus barcode={selectedOrder.tracking_number} />
// 									</Box>
// 								)}
// 							</>
// 						)}
// 					</DialogContent>
// 					<DialogActions
// 						sx={{
// 							p: 3,
// 							gap: 2,
// 							justifyContent: 'center'
// 						}}
// 					>
// 						<Button
// 							onClick={handleCloseTrackingDialog}
// 							variant='outlined'
// 							size='large'
// 							sx={{
// 								borderColor: '#757575',
// 								color: '#757575',
// 								borderRadius: '12px',
// 								px: 4,
// 								py: 1.5,
// 								fontWeight: 600,
// 								textTransform: 'none',
// 								minWidth: 120,
// 								'&:hover': {
// 									borderColor: '#424242',
// 									color: '#424242',
// 									backgroundColor: 'rgba(117, 117, 117, 0.1)'
// 								}
// 							}}
// 						>
// 							{t('Cancel')}
// 						</Button>
// 						<Button
// 							onClick={handleUpdateTracking}
// 							variant='contained'
// 							size='large'
// 							disabled={trackingLoading}
// 							sx={{
// 								backgroundColor: '#1976d2',
// 								color: 'white',
// 								borderRadius: '12px',
// 								px: 4,
// 								py: 1.5,
// 								fontWeight: 600,
// 								textTransform: 'none',
// 								minWidth: 120,
// 								boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
// 								'&:hover': {
// 									backgroundColor: '#1565c0',
// 									boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
// 									transform: 'translateY(-2px)'
// 								}
// 							}}
// 						>
// 							{trackingLoading ? t('Updating...') : t('Update Tracking')}
// 						</Button>
// 					</DialogActions>
// 				</Dialog>

// 				{/* Confirm Payment Dialog */}
// 				<Dialog
// 					open={confirmPaymentDialogOpen}
// 					onClose={handleCloseConfirmPaymentDialog}
// 					maxWidth='sm'
// 					fullWidth
// 					PaperProps={{
// 						sx: {
// 							borderRadius: '16px',
// 							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
// 						}
// 					}}
// 				>
// 					<DialogTitle
// 						sx={{
// 							background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
// 							color: 'white',
// 							fontWeight: 'bold',
// 							py: 3,
// 							textAlign: 'center',
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'center',
// 							gap: 2,
// 							position: 'relative'
// 						}}
// 					>
// 						<ConfirmIcon sx={{ fontSize: 28 }} />
// 						{t('Confirm Payment')}
// 						<IconButton
// 							onClick={handleCloseConfirmPaymentDialog}
// 							sx={{
// 								position: 'absolute',
// 								right: 8,
// 								top: '50%',
// 								transform: 'translateY(-50%)',
// 								color: 'white',
// 								'&:hover': {
// 									backgroundColor: 'rgba(255, 255, 255, 0.1)'
// 								}
// 							}}
// 						>
// 							<CloseIcon />
// 						</IconButton>
// 					</DialogTitle>
// 					<DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
// 						{selectedOrder && (
// 							<>
// 								<Typography
// 									variant='h6'
// 									sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
// 								>
// 									{t('Order')} #{selectedOrder.invoice_no}
// 								</Typography>
// 								<Box sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
// 									<Grid
// 										container
// 										spacing={2}
// 									>
// 										<Grid
// 											item
// 											xs={6}
// 										>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 											>
// 												{t('Customer')}:
// 											</Typography>
// 											<Typography
// 												variant='body1'
// 												sx={{ fontWeight: 600 }}
// 											>
// 												{selectedOrder.first_name} {selectedOrder.last_name}
// 											</Typography>
// 										</Grid>
// 										<Grid
// 											item
// 											xs={6}
// 										>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 											>
// 												{t('Email')}:
// 											</Typography>
// 											<Typography
// 												variant='body1'
// 												sx={{ fontWeight: 600 }}
// 											>
// 												{selectedOrder.email || 'N/A'}
// 											</Typography>
// 										</Grid>
// 										<Grid
// 											item
// 											xs={6}
// 										>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 											>
// 												{t('Total Amount')}:
// 											</Typography>
// 											<Typography
// 												variant='body1'
// 												sx={{ fontWeight: 600, color: '#1976d2' }}
// 											>
// 												฿
// 												{parseFloat(selectedOrder.total_amount).toLocaleString('th-TH', {
// 													minimumFractionDigits: 2,
// 													maximumFractionDigits: 2
// 												})}
// 											</Typography>
// 										</Grid>
// 										<Grid
// 											item
// 											xs={6}
// 										>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 											>
// 												{t('Payment Method')}:
// 											</Typography>
// 											<Typography
// 												variant='body1'
// 												sx={{ fontWeight: 600, textTransform: 'capitalize' }}
// 											>
// 												{selectedOrder.payment_method}
// 											</Typography>
// 										</Grid>
// 									</Grid>
// 								</Box>
// 								<Typography
// 									variant='body2'
// 									color='text.secondary'
// 									sx={{ mb: 3, lineHeight: 1.6, textAlign: 'center' }}
// 								>
// 									{t('This will send a confirmation email to the customer notifying them that their payment has been confirmed and their order is being prepared for shipment.')}
// 								</Typography>
// 							</>
// 						)}
// 					</DialogContent>
// 					<DialogActions
// 						sx={{
// 							p: 3,
// 							gap: 2,
// 							justifyContent: 'center'
// 						}}
// 					>
// 						<Button
// 							onClick={handleCloseConfirmPaymentDialog}
// 							variant='outlined'
// 							size='large'
// 							sx={{
// 								borderColor: '#757575',
// 								color: '#757575',
// 								borderRadius: '12px',
// 								px: 4,
// 								py: 1.5,
// 								fontWeight: 600,
// 								textTransform: 'none',
// 								minWidth: 120,
// 								'&:hover': {
// 									borderColor: '#424242',
// 									color: '#424242',
// 									backgroundColor: 'rgba(117, 117, 117, 0.1)'
// 								}
// 							}}
// 						>
// 							{t('Cancel')}
// 						</Button>
// 						<Button
// 							onClick={handleConfirmPayment}
// 							variant='contained'
// 							size='large'
// 							disabled={isConfirmingPayment}
// 							startIcon={<EmailIcon />}
// 							sx={{
// 								backgroundColor: '#2e7d32',
// 								color: 'white',
// 								borderRadius: '12px',
// 								px: 4,
// 								py: 1.5,
// 								fontWeight: 600,
// 								textTransform: 'none',
// 								minWidth: 120,
// 								boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
// 								'&:hover': {
// 									backgroundColor: '#1b5e20',
// 									boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
// 									transform: 'translateY(-2px)'
// 								}
// 							}}
// 						>
// 							{isConfirmingPayment ? t('Sending Email...') : t('Send Confirmation Email')}
// 						</Button>
// 					</DialogActions>
// 				</Dialog>

// 				{/* Mark as Completed Dialog */}
// 				<Dialog
// 					open={markCompletedDialogOpen}
// 					onClose={handleCloseMarkCompletedDialog}
// 					maxWidth='sm'
// 					fullWidth
// 					PaperProps={{
// 						sx: {
// 							borderRadius: '16px',
// 							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
// 						}
// 					}}
// 				>
// 					<DialogTitle
// 						sx={{
// 							background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
// 							color: 'white',
// 							fontWeight: 'bold',
// 							py: 3,
// 							textAlign: 'center',
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'center',
// 							gap: 2,
// 							position: 'relative'
// 						}}
// 					>
// 						<CheckCircleIcon sx={{ fontSize: 28 }} />
// 						{t('Mark Order as Completed')}
// 						<IconButton
// 							onClick={handleCloseMarkCompletedDialog}
// 							sx={{
// 								position: 'absolute',
// 								right: 8,
// 								top: '50%',
// 								transform: 'translateY(-50%)',
// 								color: 'white',
// 								'&:hover': {
// 									backgroundColor: 'rgba(255, 255, 255, 0.1)'
// 								}
// 							}}
// 						>
// 							<CloseIcon />
// 						</IconButton>
// 					</DialogTitle>
// 					<DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
// 						{selectedOrder && (
// 							<>
// 								<Typography
// 									variant='h6'
// 									sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
// 								>
// 									{t('Order')} #{selectedOrder.invoice_no}
// 								</Typography>
// 								<Box sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
// 									<Grid
// 										container
// 										spacing={2}
// 									>
// 										<Grid
// 											item
// 											xs={6}
// 										>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 											>
// 												{t('Customer')}
// 											</Typography>
// 											<Typography
// 												variant='body1'
// 												sx={{ fontWeight: 600 }}
// 											>
// 												{selectedOrder.first_name} {selectedOrder.last_name}
// 											</Typography>
// 										</Grid>
// 										<Grid
// 											item
// 											xs={6}
// 										>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 											>
// 												{t('Current Status:')}
// 											</Typography>
// 											<Typography
// 												variant='body1'
// 												sx={{ fontWeight: 600 }}
// 											>
// 												{selectedOrder.order_status}
// 											</Typography>
// 										</Grid>
// 										<Grid
// 											item
// 											xs={6}
// 										>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 											>
// 												{t('Tracking Number:')}
// 											</Typography>
// 											<Typography
// 												variant='body1'
// 												sx={{ fontWeight: 600, fontFamily: 'monospace' }}
// 											>
// 												{selectedOrder.tracking_number || 'N/A'}
// 											</Typography>
// 										</Grid>
// 										<Grid
// 											item
// 											xs={6}
// 										>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 											>
// 												{t('Total Amount:')}
// 											</Typography>
// 											<Typography
// 												variant='body1'
// 												sx={{ fontWeight: 600, color: '#1976d2' }}
// 											>
// 												฿
// 												{parseFloat(selectedOrder.total_amount).toLocaleString('th-TH', {
// 													minimumFractionDigits: 2,
// 													maximumFractionDigits: 2
// 												})}
// 											</Typography>
// 										</Grid>
// 									</Grid>
// 								</Box>
// 								<Alert
// 									severity='info'
// 									sx={{ mb: 2 }}
// 								>
// 									<Typography
// 										variant='body2'
// 										sx={{ lineHeight: 1.6 }}
// 									>
// 										{t('This will mark the order as "Completed" and move it to the Completed section. This action indicates that the order has been successfully delivered to the customer.')}
// 									</Typography>
// 								</Alert>
// 								<Typography
// 									variant='body2'
// 									color='text.secondary'
// 									sx={{ mb: 3, lineHeight: 1.6, textAlign: 'center' }}
// 								>
// 									{t('Are you sure you want to mark this order as completed?')}
// 								</Typography>
// 							</>
// 						)}
// 					</DialogContent>
// 					<DialogActions
// 						sx={{
// 							p: 3,
// 							gap: 2,
// 							justifyContent: 'center'
// 						}}
// 					>
// 						<Button
// 							onClick={handleCloseMarkCompletedDialog}
// 							variant='outlined'
// 							size='large'
// 							sx={{
// 								borderColor: '#757575',
// 								color: '#757575',
// 								borderRadius: '12px',
// 								px: 4,
// 								py: 1.5,
// 								fontWeight: 600,
// 								textTransform: 'none',
// 								minWidth: 120,
// 								'&:hover': {
// 									borderColor: '#424242',
// 									color: '#424242',
// 									backgroundColor: 'rgba(117, 117, 117, 0.1)'
// 								}
// 							}}
// 						>
// 							{t('Cancel')}
// 						</Button>
// 						<Button
// 							onClick={handleMarkAsCompleted}
// 							variant='contained'
// 							size='large'
// 							disabled={isMarkingCompleted}
// 							startIcon={<CheckCircleIcon />}
// 							sx={{
// 								backgroundColor: '#1b5e20',
// 								color: 'white',
// 								borderRadius: '12px',
// 								px: 4,
// 								py: 1.5,
// 								fontWeight: 600,
// 								textTransform: 'none',
// 								minWidth: 120,
// 								boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)',
// 								'&:hover': {
// 									backgroundColor: '#2e7d32',
// 									boxShadow: '0 6px 16px rgba(27, 94, 32, 0.4)',
// 									transform: 'translateY(-2px)'
// 								}
// 							}}
// 						>
// 							{isMarkingCompleted ? t('Marking as Completed...') : t('Mark as Completed')}
// 						</Button>
// 					</DialogActions>
// 				</Dialog>

// 				{/* Snackbar for notifications */}
// 				<Snackbar
// 					open={snackbarOpen}
// 					autoHideDuration={5000}
// 					onClose={handleCloseSnackbar}
// 					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// 				>
// 					<Alert
// 						onClose={handleCloseSnackbar}
// 						severity={snackbarSeverity}
// 						variant='filled'
// 						sx={{ width: '100%' }}
// 					>
// 						{snackbarMessage}
// 					</Alert>
// 				</Snackbar>
// 			</Paper>
// 		</Box>
// 	);
// }

// export default OrdersTable;

import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import TrackingStatus from './order/tabs/details/TrackingStatus';
import {
	ListItemIcon,
	MenuItem,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	IconButton,
	Snackbar,
	Alert,
	Box,
	Grid,
	Chip,
	Typography,
	Button
} from '@mui/material';
import {
	LocalShipping as TrackingIcon,
	Close as CloseIcon,
	CheckCircle as CheckCircleIcon,
	AccessTime as AccessTimeIcon,
	Cancel as CancelIcon,
	ErrorOutline as ErrorIcon,
	Pending as PendingIcon,
	Payment as PaymentIcon,
	Preview as PreviewIcon,
	TrendingUp as TrendingUpIcon,
	Email as EmailIcon,
	ConfirmationNumber as ConfirmIcon
} from '@mui/icons-material';
import Link from '@fuse/core/Link';
import FuseLoading from '@fuse/core/FuseLoading';
import {
	Order,
	useGetOrdersFromNewApiQuery,
	useDeleteOrdersFromNewApiMutation,
	useUpdateOrderTrackingMutation
} from '../ECommerceApi';
import { CreditCardIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 👉 ใช้ alpha / useTheme จาก styles (ถูกต้องสำหรับ MUI v5)
import { alpha, useTheme } from '@mui/material/styles';

// Extended Order interface to include tracking status
interface OrderWithTrackingStatus extends Order {
	trackingStatus?: 'pending' | 'shipped' | 'delivered' | 'exception' | null;
}

// Status configuration with modern Material-UI colors and icons (moved outside component)
const statusConfig: Record<
	string,
	{ color: string; bgColor: string; icon: any; category: string }
> = {
	'Awaiting check payment': {
		color: '#1976d2',
		bgColor: alpha('#1976d2', 0.08),
		icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
		category: 'pending'
	},
	'Awaiting bank wire payment': {
		color: '#0277bd',
		bgColor: alpha('#0277bd', 0.08),
		icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
		category: 'pending'
	},
	'Awaiting PayPal payment': {
		color: '#01579b',
		bgColor: alpha('#01579b', 0.08),
		icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
		category: 'pending'
	},
	'Awaiting Cash-on-delivery payment': {
		color: '#0d47a1',
		bgColor: alpha('#0d47a1', 0.08),
		icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
		category: 'pending'
	},
	'Payment accepted': {
		color: '#2e7d32',
		bgColor: alpha('#2e7d32', 0.08),
		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
		category: 'processing'
	},
	'Remote payment accepted': {
		color: '#1b5e20',
		bgColor: alpha('#1b5e20', 0.08),
		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
		category: 'processing'
	},
	'Preparing the order': {
		color: '#ed6c02',
		bgColor: alpha('#ed6c02', 0.08),
		icon: <PendingIcon sx={{ fontSize: 20 }} />,
		category: 'processing'
	},
	Shipped: {
		color: '#9c27b0',
		bgColor: alpha('#9c27b0', 0.08),
		icon: <TrackingIcon sx={{ fontSize: 20 }} />,
		category: 'shipped'
	},
	Delivered: {
		color: '#1b5e20',
		bgColor: alpha('#1b5e20', 0.08),
		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
		category: 'completed'
	},
	Completed: {
		color: '#1b5e20',
		bgColor: alpha('#1b5e20', 0.08),
		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
		category: 'completed'
	},
	Canceled: {
		color: '#d32f2f',
		bgColor: alpha('#d32f2f', 0.08),
		icon: <CancelIcon sx={{ fontSize: 20 }} />,
		category: 'canceled'
	},
	Refunded: {
		color: '#c62828',
		bgColor: alpha('#c62828', 0.08),
		icon: <ErrorIcon sx={{ fontSize: 20 }} />,
		category: 'canceled'
	},
	'Payment error': {
		color: '#b71c1c',
		bgColor: alpha('#b71c1c', 0.08),
		icon: <ErrorIcon sx={{ fontSize: 20 }} />,
		category: 'error'
	},
	'On pre-order (paid)': {
		color: '#7b1fa2',
		bgColor: alpha('#7b1fa2', 0.08),
		icon: <PaymentIcon sx={{ fontSize: 20 }} />,
		category: 'pending'
	},
	'On pre-order (not paid)': {
		color: '#4a148c',
		bgColor: alpha('#4a148c', 0.08),
		icon: <PreviewIcon sx={{ fontSize: 20 }} />,
		category: 'pending'
	},
	paid: {
		color: '#2e7d32',
		bgColor: alpha('#2e7d32', 0.08),
		icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
		category: 'processing'
	}
	// 'completed' (ตัวเล็ก) จะถูกจัดการใน Cell renderer โดยตรง
};

// Improved tracking status checker that works with your TrackingStatus component
async function getTrackingStatusFromAPI(
	trackingNumber: string
): Promise<'pending' | 'shipped' | 'delivered' | 'exception' | null> {
	try {
		const API_Endpoint = import.meta.env.VITE_API_BASE_URL;
		const response = await fetch(`${API_Endpoint}/tracking/status/${trackingNumber}`);

		if (response.ok) {
			const data = await response.json();
			switch (data.status?.toLowerCase()) {
				case 'delivered':
				case 'completed':
				case 'success':
					return 'delivered';
				case 'shipped':
				case 'in_transit':
				case 'out_for_delivery':
					return 'shipped';
				case 'exception':
				case 'failed':
				case 'returned':
				case 'error':
					return 'exception';
				case 'pending':
				case 'processing':
					return 'pending';
				default:
					return 'shipped';
			}
		}
	} catch (error) {
		console.error('Error fetching tracking status from API:', error);
	}
	return getTrackingStatusSync(trackingNumber);
}

// Enhanced tracking status checker with common Thai postal patterns
function getTrackingStatusSync(trackingNumber: string): 'pending' | 'shipped' | 'delivered' | 'exception' | null {
	if (!trackingNumber) return null;

	const upperTracking = trackingNumber.toUpperCase();
	const lowerTracking = trackingNumber.toLowerCase();

	if (
		upperTracking.includes('DELIVERED') ||
		upperTracking.includes('DLV') ||
		upperTracking.includes('COMPLETED') ||
		upperTracking.includes('SUCCESS') ||
		lowerTracking.includes('delivered') ||
		lowerTracking.includes('จัดส่งสำเร็จ') ||
		lowerTracking.includes('ส่งสำเร็จ') ||
		lowerTracking.includes('delivered successfully')
	) {
		return 'delivered';
	}

	if (
		upperTracking.includes('EXCEPTION') ||
		upperTracking.includes('FAILED') ||
		upperTracking.includes('RETURNED') ||
		upperTracking.includes('ERROR') ||
		upperTracking.includes('REJECTED') ||
		lowerTracking.includes('exception') ||
		lowerTracking.includes('ไม่สามารถส่งได้') ||
		lowerTracking.includes('ส่งไม่สำเร็จ')
	) {
		return 'exception';
	}

	if (
		upperTracking.includes('PENDING') ||
		upperTracking.includes('PROCESSING') ||
		upperTracking.includes('PREPARING') ||
		lowerTracking.includes('กำลังเตรียม') ||
		lowerTracking.includes('รอการจัดส่ง')
	) {
		return 'pending';
	}

	return 'shipped';
}

// Alternative method: Parse TrackingStatus component DOM to extract status
function getTrackingStatusFromDOM(
	trackingNumber: string
): Promise<'pending' | 'shipped' | 'delivered' | 'exception' | null> {
	return new Promise((resolve) => {
		try {
			const tempContainer = document.createElement('div');
			tempContainer.style.position = 'absolute';
			tempContainer.style.left = '-9999px';
			tempContainer.style.top = '-9999px';
			tempContainer.style.visibility = 'hidden';
			tempContainer.style.pointerEvents = 'none';
			document.body.appendChild(tempContainer);

			import('react')
				.then((React) => {
					import('react-dom/client')
						.then((ReactDOM) => {
							const trackingElement = React.createElement(TrackingStatus, {
								barcode: trackingNumber
							});

							const root = ReactDOM.createRoot(tempContainer);
							root.render(trackingElement);

							setTimeout(() => {
								try {
									const statusText = tempContainer.textContent?.toLowerCase() || '';
									if (
										statusText.includes('delivered') ||
										statusText.includes('completed') ||
										statusText.includes('success') ||
										statusText.includes('จัดส่งสำเร็จ') ||
										statusText.includes('ส่งสำเร็จ')
									) {
										resolve('delivered');
									} else if (
										statusText.includes('exception') ||
										statusText.includes('failed') ||
										statusText.includes('error') ||
										statusText.includes('returned') ||
										statusText.includes('ไม่สามารถส่งได้')
									) {
										resolve('exception');
									} else if (
										statusText.includes('shipped') ||
										statusText.includes('in transit') ||
										statusText.includes('out for delivery') ||
										statusText.includes('กำลังจัดส่ง')
									) {
										resolve('shipped');
									} else if (
										statusText.includes('pending') ||
										statusText.includes('processing') ||
										statusText.includes('กำลังเตรียม')
									) {
										resolve('pending');
									} else {
										resolve('shipped');
									}
								} catch (parseError) {
									console.error('Error parsing tracking status from DOM:', parseError);
									resolve('shipped');
								} finally {
									if (document.body.contains(tempContainer)) {
										document.body.removeChild(tempContainer);
									}
								}
							}, 2000);
						})
						.catch(() => {
							document.body.removeChild(tempContainer);
							resolve('shipped');
						});
				})
				.catch(() => {
					document.body.removeChild(tempContainer);
					resolve('shipped');
				});
		} catch (error) {
			console.error('Error creating tracking status DOM check:', error);
			resolve('shipped');
		}
	});
}



function OrdersTable() {
	const theme = useTheme();
	const { t } = useTranslation('EcommPage');
	const { data: orders, isLoading, error } = useGetOrdersFromNewApiQuery();
	const [deleteOrdersMutation, { isLoading: isDeleting }] = useDeleteOrdersFromNewApiMutation();
	const [updateTrackingMutation, { isLoading: isUpdatingTracking }] = useUpdateOrderTrackingMutation();
	const [trackingLoading, setTrackingLoading] = useState<boolean>(false);

	// Tracking dialog states
	const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [trackingNumber, setTrackingNumber] = useState('');
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
	const isPendingOrder = (order: OrderWithTrackingStatus) => {
		return getEffectiveCategory(order) === 'pending';
	  };

	// Confirm payment dialog states
	const [confirmPaymentDialogOpen, setConfirmPaymentDialogOpen] = useState(false);
	const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

	// Mark as completed dialog states
	const [markCompletedDialogOpen, setMarkCompletedDialogOpen] = useState(false);
	const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);

	// Status filter states
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [filteredOrders, setFilteredOrders] = useState<OrderWithTrackingStatus[]>([]);

	// Process orders with tracking status
	const [ordersWithTrackingStatus, setOrdersWithTrackingStatus] = useState<OrderWithTrackingStatus[]>([]);

	useEffect(() => {
		const processOrdersWithTracking = async () => {
			if (!orders) {
				setOrdersWithTrackingStatus([]);
				return;
			}

			const processedOrders = await Promise.all(
				orders.map(async (order) => {
					let trackingStatus: 'pending' | 'shipped' | 'delivered' | 'exception' | null = null;

					if (order.order_status.toLowerCase() === 'completed') {
						return {
							...order,
							trackingStatus: 'delivered'
						} as OrderWithTrackingStatus;
					}

					if (order.tracking_number) {
						try {
							trackingStatus = await getTrackingStatusFromAPI(order.tracking_number);
						} catch (error) {
							/* ignore */
						}

						if (!trackingStatus || trackingStatus === 'shipped') {
							const syncStatus = getTrackingStatusSync(order.tracking_number);
							if (syncStatus && syncStatus !== 'shipped') {
								trackingStatus = syncStatus;
							}
						}

						if (!trackingStatus) {
							trackingStatus = 'shipped';
						}
					}

					return {
						...order,
						trackingStatus
					} as OrderWithTrackingStatus;
				})
			);

			setOrdersWithTrackingStatus(processedOrders);
		};

		processOrdersWithTracking();
	}, [orders]);

	const refreshTrackingStatus = async () => {
		if (!orders) return;

		const processedOrders = await Promise.all(
			orders.map(async (order) => {
				let trackingStatus: 'pending' | 'shipped' | 'delivered' | 'exception' | null = null;

				if (order.order_status.toLowerCase() === 'completed') {
					return {
						...order,
						trackingStatus: 'delivered'
					} as OrderWithTrackingStatus;
				}

				if (order.tracking_number) {
					try {
						trackingStatus = await getTrackingStatusFromDOM(order.tracking_number);
					} catch (error) {
						trackingStatus = getTrackingStatusSync(order.tracking_number);
					}
				}

				return {
					...order,
					trackingStatus
				} as OrderWithTrackingStatus;
			})
		);

		setOrdersWithTrackingStatus(processedOrders);
		setSnackbarMessage('Tracking status refreshed successfully');
		setSnackbarSeverity('success');
		setSnackbarOpen(true);
	};

	const getEffectiveCategory = (order: OrderWithTrackingStatus): string => {
		const lowerOrderStatus = order.order_status.toLowerCase();

		if (lowerOrderStatus === 'completed' || lowerOrderStatus === 'delivered') {
			return 'completed';
		}

		if (order.tracking_number && order.trackingStatus === 'delivered') {
			return 'completed';
		}

		if (order.tracking_number && (order.trackingStatus === 'shipped' || order.trackingStatus === 'pending')) {
			return 'shipped';
		}

		if (order.tracking_number && order.trackingStatus === 'exception') {
			const config = statusConfig[order.order_status];
			return config?.category || 'error';
		}

		const config = statusConfig[order.order_status];
		if (config?.category) return config.category;

		if (
			lowerOrderStatus.includes('pending') ||
			lowerOrderStatus.includes('awaiting') ||
			lowerOrderStatus.includes('waiting')
		) {
			return 'pending';
		} else if (
			lowerOrderStatus.includes('processing') ||
			lowerOrderStatus.includes('preparing') ||
			lowerOrderStatus.includes('accepted')
		) {
			return 'processing';
		} else if (lowerOrderStatus.includes('shipped') || lowerOrderStatus.includes('shipping')) {
			return 'shipped';
		} else if (lowerOrderStatus.includes('cancel') || lowerOrderStatus.includes('refund')) {
			return 'canceled';
		} else if (lowerOrderStatus.includes('error') || lowerOrderStatus.includes('failed')) {
			return 'error';
		}

		return 'unknown';
	};

	const canMarkAsCompleted = (orderStatus: string, trackingNumber?: string, currentTrackingStatus?: string) => {
		if (!trackingNumber || !trackingNumber.trim()) return false;

		const normalizedStatus = orderStatus.toLowerCase();
		if (
			currentTrackingStatus === 'delivered' ||
			normalizedStatus === 'completed' ||
			normalizedStatus === 'delivered'
		) {
			return false;
		}

		return (
			normalizedStatus.includes('shipped') ||
			normalizedStatus.includes('preparing') ||
			normalizedStatus === 'payment accepted' ||
			normalizedStatus === 'paid' ||
			normalizedStatus === 'remote payment accepted' ||
			currentTrackingStatus === 'shipped' ||
			currentTrackingStatus === 'pending'
		);
	};

	const canConfirmPayment = (orderStatus: string, trackingNumber?: string) => {
		if (trackingNumber && trackingNumber.trim() !== '') return false;

		const normalizedStatus = orderStatus.toLowerCase();
		return (
			normalizedStatus === 'payment accepted' ||
			normalizedStatus === 'paid' ||
			normalizedStatus === 'remote payment accepted'
		);
	};

	const columns = useMemo<MRT_ColumnDef<OrderWithTrackingStatus>[]>(
		() => [
			{
				accessorKey: 'invoice_no',
				header: t('Invoice No.'),
				size: 140,
				Cell: ({ row }) => (
					<Typography component={Link} to={`/apps/e-commerce/orders/${row.original.order_id}`} role='button'>
						<u>{row.original.invoice_no}</u>
					</Typography>
				)
			},
			{
				accessorKey: 'tracking_number',
				header: t('Tracking'),
				size: 140,
				Cell: ({ row }) => {
					const hasTracking = row.original.tracking_number;
					return (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
							<Typography
								sx={{
									fontFamily: `'IBM Plex Sans Thai', 'Noto Sans Thai', 'Kanit', sans-serif`,
									fontSize: '1.5rem',
									fontWeight: hasTracking ? 600 : 400,
									color: hasTracking ? '#2e7d32' : '#757575',
									px: 1.5,
									py: 0.75,
								}}
								>
								{row.original.tracking_number || t('Not assigned')}
							</Typography>
						</Box>
					);
				}
			},
			{
				accessorFn: (row) => `${row.first_name} ${row.last_name}`,
				header: t('Customer Name'),
				size: 100,
				Cell: ({ cell }) => (
					<Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>{cell.getValue<string>()}</Typography>
				),
				id: 'full_name'
			},
			{
				accessorKey: 'total_amount',
				header: t('Total Amount'),
				size: 120,
				Cell: ({ row }) => (
					<Typography
						sx={{
							fontWeight: 600,
							fontSize: '1.5rem',
							color: '#1976d2'
						}}
					>
						฿{' '}
						{parseFloat(row.original.total_amount).toLocaleString('th-TH', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					</Typography>
				)
			},
			{
				accessorKey: 'payment_method',
				header: t('Payment Method'),
				size: 140,
				Cell: ({ row }) => (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<CreditCardIcon />
						<Typography
							sx={{
								textTransform: 'capitalize',
								fontWeight: 500,
								fontSize: '1.5rem',
								px: 1.5,
								py: 0.75
							}}
						>
							{row.original.payment_method}
						</Typography>
					</div>
				)
			},
			{
				accessorKey: 'order_status',
				header: t('Status'),
				size: 160,
				Cell: ({ row }) => {
					const status = row.original.order_status;
					const hasTracking = row.original.tracking_number;
					const trackingStatus = row.original.trackingStatus;

					const config =
						statusConfig[status] || (status.toLowerCase() === 'completed' ? statusConfig['Completed'] : null);

					let displayStatus = status;
					let finalConfig = config;
					const lowerStatus = status.toLowerCase();

					if (lowerStatus === 'completed' || lowerStatus === 'delivered') {
						displayStatus = 'Completed';
						finalConfig = {
							color: '#1b5e20',
							bgColor: alpha('#1b5e20', 0.08),
							icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
							category: 'completed'
						};
					} else if (hasTracking && trackingStatus === 'delivered') {
						displayStatus = 'Completed';
						finalConfig = {
							color: '#1b5e20',
							bgColor: alpha('#1b5e20', 0.08),
							icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
							category: 'completed'
						};
					} else if (hasTracking && (trackingStatus === 'shipped' || trackingStatus === 'pending')) {
						displayStatus = 'Shipped';
						finalConfig = {
							color: '#9c27b0',
							bgColor: alpha('#9c27b0', 0.08),
							icon: <TrackingIcon sx={{ fontSize: 20 }} />,
							category: 'shipped'
						};
					} else if (hasTracking && trackingStatus === 'exception') {
						displayStatus = 'Delivery Exception';
						finalConfig = {
							color: '#d32f2f',
							bgColor: alpha('#d32f2f', 0.08),
							icon: <ErrorIcon sx={{ fontSize: 20 }} />,
							category: 'error'
						};
					}

					if (!finalConfig) {
						if (lowerStatus === 'paid' || lowerStatus.includes('paid')) {
							finalConfig = {
								color: '#2e7d32',
								bgColor: alpha('#2e7d32', 0.08),
								icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
								category: 'processing'
							};
						} else if (lowerStatus.includes('pending') || lowerStatus.includes('waiting')) {
							finalConfig = {
								color: '#1976d2',
								bgColor: alpha('#1976d2', 0.08),
								icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
								category: 'pending'
							};
						} else if (lowerStatus.includes('cancel') || lowerStatus.includes('refund')) {
							finalConfig = {
								color: '#d32f2f',
								bgColor: alpha('#d32f2f', 0.08),
								icon: <CancelIcon sx={{ fontSize: 20 }} />,
								category: 'canceled'
							};
						} else {
							finalConfig = {
								color: '#757575',
								bgColor: alpha('#757575', 0.08),
								icon: <PendingIcon sx={{ fontSize: 20 }} />,
								category: 'unknown'
							};
						}
					}

					const chipBg = alpha(finalConfig.color, theme.palette.mode === 'dark' ? 0.18 : 0.10);
					const chipBorder = alpha(finalConfig.color, theme.palette.mode === 'dark' ? 0.40 : 0.22);

					return (
						<Box
							sx={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 1,
								px: 2.5,
								py: 1,
								borderRadius: '16px',
								backgroundColor: chipBg,
								color: finalConfig.color,
								border: `1px solid ${chipBorder}`,
								fontWeight: 600,
								fontSize: '1.5rem',
								minHeight: '32px',
								backdropFilter: 'blur(6px) saturate(120%)',
								WebkitBackdropFilter: 'blur(6px) saturate(120%)'
							}}
						>
							{finalConfig.icon}
							<Typography
								variant='body2'
								sx={{ fontWeight: 600, fontSize: '1.5rem', color: 'inherit' }}
							>
								{displayStatus}
							</Typography>
						</Box>
					);
				}
			},
			{
				accessorKey: 'created_at',
				header: t('Created Date'),
				size: 160,
				Cell: ({ row }) => (
					<Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
						{new Date(row.original.created_at).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</Typography>
				)
			}
		],
		[theme, t]
	);

	const handleDeleteOrder = async (orderId: number) => {
		try {
			await deleteOrdersMutation([orderId]).unwrap();
			setSnackbarMessage('Order deleted successfully');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
		} catch (error) {
			console.error('Failed to delete order:', error);
			setSnackbarMessage('Failed to delete order');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	const handleDeleteSelectedOrders = async (selectedRows: any[]) => {
		try {
			const orderIds = selectedRows.map((row) => row.original.order_id);
			await deleteOrdersMutation(orderIds).unwrap();
			setSnackbarMessage('Orders deleted successfully');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
		} catch (error) {
			console.error('Failed to delete orders:', error);
			setSnackbarMessage('Failed to delete orders');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	// Tracking number handlers
	const handleOpenTrackingDialog = (order: Order) => {
		setSelectedOrder(order);
		setTrackingNumber(order.tracking_number || '');
		setTrackingDialogOpen(true);
	};

	const handleCloseTrackingDialog = () => {
		setTrackingDialogOpen(false);
		setSelectedOrder(null);
		setTrackingNumber('');
	};

	const handleUpdateTracking = async () => {
		if (!selectedOrder) return;

		setTrackingLoading(true);
		try {
			const API_Endpoint = import.meta.env.VITE_API_BASE_URL;
			await updateTrackingMutation({
				orderId: selectedOrder.order_id,
				tracking_number: trackingNumber
			}).unwrap();

			await fetch(`${API_Endpoint}/order/orderTransaction`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(selectedOrder)
			});

			setSnackbarMessage(t('Tracking number updated successfully'));
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			handleCloseTrackingDialog();
			setTrackingLoading(false);
		} catch (error) {
			console.error('Failed to update tracking number:', error);
			setSnackbarMessage('Failed to update tracking number');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	// Confirm payment handlers
	const handleOpenConfirmPaymentDialog = (order: Order) => {
		setSelectedOrder(order);
		setConfirmPaymentDialogOpen(true);
	};

	const handleCloseConfirmPaymentDialog = () => {
		setConfirmPaymentDialogOpen(false);
		setSelectedOrder(null);
	};

	const handleConfirmPayment = async () => {
		if (!selectedOrder) return;

		setIsConfirmingPayment(true);
		try {
			const API_Endpoint = import.meta.env.VITE_API_BASE_URL;
			await updateTrackingMutation({
				orderId: selectedOrder.order_id,
				tracking_number: trackingNumber
			}).unwrap();

			await fetch(`${API_Endpoint}/order/orderTransaction`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(selectedOrder)
			});

			setSnackbarMessage(t('Payment confirmation email sent successfully'));
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			handleCloseConfirmPaymentDialog();
		} catch (error) {
			console.error('Failed to confirm payment:', error);
			setSnackbarMessage('Failed to send confirmation email');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		} finally {
			setIsConfirmingPayment(false);
		}
	};

	// Mark as completed handlers
	const handleOpenMarkCompletedDialog = (order: Order) => {
		setSelectedOrder(order);
		setMarkCompletedDialogOpen(true);
	};

	const handleCloseMarkCompletedDialog = () => {
		setMarkCompletedDialogOpen(false);
		setSelectedOrder(null);
	};

	const handleMarkAsCompleted = async () => {
		if (!selectedOrder) return;

		setIsMarkingCompleted(true);
		try {
			const API_Endpoint = import.meta.env.VITE_API_BASE_URL;

			const res = await fetch(`${API_Endpoint}/order/updateStatus`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					invoice_no: selectedOrder.invoice_no,
					order_status: 'completed',
					tracking_number: selectedOrder.tracking_number || null,
					notes: 'Order marked as completed'
				})
			});

			if (!res.ok) throw new Error('Failed to update order status');

			await fetch(`${API_Endpoint}/order/orderTransaction`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...selectedOrder,
					order_status: 'completed',
					tracking_status: 'completed'
				})
			});

			setOrdersWithTrackingStatus((prevOrders) =>
				prevOrders.map((order) =>
					order.order_id === selectedOrder.order_id
						? {
								...order,
								order_status: 'completed',
								trackingStatus: 'delivered' as const
							}
						: order
				)
			);

			setSnackbarMessage(t('Order marked as completed successfully'));
			setSnackbarSeverity('success');
		} catch (error) {
			console.error('Failed to mark order as completed:', error);
			setSnackbarMessage('Failed to mark order as completed');
			setSnackbarSeverity('error');
		} finally {
			setSnackbarOpen(true);
			handleCloseMarkCompletedDialog();
			setIsMarkingCompleted(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	};

	// Filter orders based on selected status
	useEffect(() => {
		if (!ordersWithTrackingStatus) {
			setFilteredOrders([]);
			return;
		}

		if (selectedStatus === 'all') {
			setFilteredOrders(ordersWithTrackingStatus);
		} else {
			const filtered = ordersWithTrackingStatus.filter((order) => {
				const effectiveCategory = getEffectiveCategory(order);
				return effectiveCategory === selectedStatus;
			});
			setFilteredOrders(filtered);
		}
	}, [ordersWithTrackingStatus, selectedStatus]);

	// Calculate status counts
	const useMemoizedStatusCounts = () =>
		useMemo(() => {
			if (!ordersWithTrackingStatus) return {};

			const counts: Record<string, number> = {
				all: ordersWithTrackingStatus.length,
				pending: 0,
				processing: 0,
				shipped: 0,
				completed: 0,
				canceled: 0,
				error: 0
			};

			ordersWithTrackingStatus.forEach((order) => {
				const effectiveCategory = getEffectiveCategory(order);
				if (effectiveCategory && Object.prototype.hasOwnProperty.call(counts, effectiveCategory)) {
					counts[effectiveCategory] += 1;
				}
			});

			return counts;
		}, [ordersWithTrackingStatus]);

	const statusCounts = useMemoizedStatusCounts();

	// ---------- Glassy status filters (โปร่งแสง + เบลอ) ----------
	const statusFilters = useMemo(() => {
		// โปร่งตามโหมด: dark เข้มขึ้นเล็กน้อย
		const idleAlpha = theme.palette.mode === 'dark' ? 0.16 : 0.08;
		const activeAlpha = theme.palette.mode === 'dark' ? 0.26 : 0.14;
		const borderAlpha = theme.palette.mode === 'dark' ? 0.40 : 0.22;
		const hoverBump = theme.palette.mode === 'dark' ? 0.04 : 0.03;

		const defs = [
			{ key: 'all', label: t('All Orders'), icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, color: '#757575' },
			{ key: 'pending', label: t('Pending'), icon: <AccessTimeIcon sx={{ fontSize: 16 }} />, color: '#1976d2' },
			{ key: 'processing', label: t('Processing'), icon: <PendingIcon sx={{ fontSize: 16 }} />, color: '#ed6c02' },
			{ key: 'shipped', label: t('Shipped'), icon: <TrackingIcon sx={{ fontSize: 16 }} />, color: '#9c27b0' },
			{ key: 'completed', label: t('Completed'), icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, color: '#2e7d32' },
			{ key: 'canceled', label: t('Canceled/Refunded'), icon: <CancelIcon sx={{ fontSize: 16 }} />, color: '#d32f2f' },
			{ key: 'error', label: t('Payment Error'), icon: <ErrorIcon sx={{ fontSize: 16 }} />, color: '#b71c1c' }
		] as const;

		return defs.map((d) => ({
			...d,
			bgIdle: alpha(d.color, idleAlpha),
			bgActive: alpha(d.color, activeAlpha),
			bgHoverIdle: alpha(d.color, idleAlpha + hoverBump),
			bgHoverActive: alpha(d.color, activeAlpha + hoverBump),
			border: alpha(d.color, borderAlpha),
			shadow: `0 2px 8px ${alpha(d.color, 0.28)}`
		}));
	}, [theme, t]);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (error) {
		return (
			<Paper className='flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-0 w-full h-full p-24'>
				<Typography color='error'>
					Error loading orders: {error instanceof Error ? error.message : 'Unknown error'}
				</Typography>
			</Paper>
		);
	}

	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<Paper
				className='flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-0 w-full h-full'
				elevation={0}
				sx={{ borderRadius: '16px', overflow: 'hidden' }}
			>
				<DataTable
					initialState={{
						density: 'spacious',
						showColumnFilters: false,
						showGlobalFilter: true,
						columnPinning: {
							left: ['mrt-row-expand', 'mrt-row-select'],
							right: ['mrt-row-actions']
						},
						pagination: {
							pageIndex: 0,
							pageSize: 10
						},
						sorting: [{ id: 'created_at', desc: true }]
					}}
					data={filteredOrders || []}
					columns={columns}
					renderRowActionMenuItems={({ closeMenu, row, table }) => [
						...(canMarkAsCompleted(row.original.order_status, row.original.tracking_number, row.original.trackingStatus)
							? [
									{
										key: 'markCompleted',
										component: (
											<MenuItem
												key='markCompleted'
												onClick={() => {
													handleOpenMarkCompletedDialog(row.original);
													closeMenu();
												}}
												disabled={isMarkingCompleted}
												sx={{
													color: '#1b5e20',
													'&:hover': { backgroundColor: alpha('#1b5e20', 0.10) }
												}}
											>
												<ListItemIcon>
													<CheckCircleIcon sx={{ color: '#1b5e20' }} />
												</ListItemIcon>
												{t('Mark as Completed')}
											</MenuItem>
										)
									}
								]
							: []
						).map((item) => item.component),
						...(canConfirmPayment(row.original.order_status, row.original.tracking_number)
							? [
									{
										key: 'confirmPayment',
										component: (
											<MenuItem
												key='confirmPayment'
												onClick={() => {
													handleOpenConfirmPaymentDialog(row.original);
													closeMenu();
												}}
												disabled={isConfirmingPayment}
												sx={{
													color: '#2e7d32',
													'&:hover': { backgroundColor: alpha('#2e7d32', 0.10) }
												}}
											>
												<ListItemIcon>
													<ConfirmIcon sx={{ color: '#2e7d32' }} />
												</ListItemIcon>
												{t('Confirm Payment')}
											</MenuItem>
										)
									}
								]
							: []
						).map((item) => item.component),
						...(row.original.order_status !== 'cancelled' &&
						row.original.order_status !== 'completed' &&
						row.original.order_status !== 'delivered' &&
						!isPendingOrder(row.original)
							? [
									<MenuItem
										key='tracking'
										onClick={() => {
											handleOpenTrackingDialog(row.original);
											closeMenu();
										}}
										disabled={isUpdatingTracking}
									>
										<ListItemIcon>
											<TrackingIcon />
										</ListItemIcon>
										{t('Update Tracking')}
									</MenuItem>
								]
							: [])
					]}
					renderTopToolbarCustomActions={({ table }) => {
						const { rowSelection } = table.getState();

						return (
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									flexWrap: 'wrap',
									width: '100%',
									pt: 2,
									pb: 1
								}}
							>
								{/* Status Filter Pills -> โปร่งแสง */}
								<Box
									sx={{
										display: 'flex',
										gap: 1,
										flexWrap: 'nowrap',
										overflowX: 'auto',
										scrollbarWidth: 'thin',
										'&::-webkit-scrollbar': { height: '4px' },
										'&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
										'&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' },
										'&::-webkit-scrollbar-thumb:hover': { background: '#a8a8a8' },
										pb: 1,
										minWidth: 0,
										flex: 1
									}}
								>
									{statusFilters.map((filter) => {
										const isActive = selectedStatus === filter.key;
										return (
											<Chip
												key={filter.key}
												icon={filter.icon}
												label={`${filter.label} (${statusCounts[filter.key] || 0})`}
												onClick={() => setSelectedStatus(filter.key)}
												sx={{
													cursor: 'pointer',
													transition: 'all 0.2s ease-in-out',
													backgroundColor: isActive ? filter.bgActive : filter.bgIdle,
													color: filter.color,
													border: `1px solid ${filter.border}`,
													fontWeight: isActive ? 700 : 600,
													fontSize: '0.875rem',
													height: '36px',
													whiteSpace: 'nowrap',
													minWidth: 'fit-content',
													backdropFilter: 'blur(6px) saturate(120%)',
													WebkitBackdropFilter: 'blur(6px) saturate(120%)',
													boxShadow: isActive ? filter.shadow : 'none',
													'&:hover': {
														backgroundColor: isActive ? filter.bgHoverActive : filter.bgHoverIdle,
														transform: 'translateY(-1px)'
													},
													'& .MuiChip-icon': {
														color: filter.color,
														fontSize: '16px'
													}
												}}
											/>
										);
									})}
								</Box>

								{/* ตัวอย่างปุ่ม refresh ถ้าต้องใช้
								<Button
									variant='outlined'
									size='small'
									onClick={refreshTrackingStatus}
									sx={{
										minWidth: '140px',
										borderRadius: '8px',
										textTransform: 'none',
										fontWeight: 600,
										borderColor: '#1976d2',
										color: '#1976d2',
										'&:hover': {
											borderColor: '#1565c0',
											backgroundColor: alpha('#1976d2', 0.10)
										}
									}}
									startIcon={<TrackingIcon sx={{ fontSize: 16 }} />}
								>
									Refresh Status
								</Button> */}
							</Box>
						);
					}}
				/>

				{/* Tracking Number Dialog */}
				<Dialog
					open={trackingDialogOpen}
					onClose={handleCloseTrackingDialog}
					maxWidth='sm'
					fullWidth
					PaperProps={{
						sx: {
							borderRadius: '16px',
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
						}
					}}
				>
					<DialogTitle
						sx={{
							background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
							color: 'white',
							fontWeight: 'bold',
							py: 3,
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 2,
							position: 'relative'
						}}
					>
						<TrackingIcon sx={{ fontSize: 28 }} />
						{t('Update Tracking Number')}
						<IconButton
							onClick={handleCloseTrackingDialog}
							sx={{
								position: 'absolute',
								right: 8,
								top: '50%',
								transform: 'translateY(-50%)',
								color: 'white',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.1)'
								}
							}}
						>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
					<DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
						{selectedOrder && (
							<>
								<Typography variant='h6' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
									{t('Order')} #{selectedOrder.invoice_no}
								</Typography>
								<Typography variant='body2' color='text.secondary' sx={{ mb: 3, lineHeight: 1.6 }}>
									{t(
										'Enter or update the tracking number for this order. This will help customers track their shipment and automatically update the order status to "Shipped".'
									)}
								</Typography>
								<TextField
									label={t('Tracking Number')}
									fullWidth
									value={trackingNumber}
									onChange={(e) => setTrackingNumber(e.target.value)}
									placeholder={t('Enter tracking number (e.g., TH123456789)')}
									sx={{
										'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
											borderColor: '#1976d2'
										},
										'& .MuiInputLabel-root.Mui-focused': {
											color: '#1976d2'
										}
									}}
									helperText={t('Leave empty to remove tracking number')}
								/>

								{selectedOrder.tracking_number && (
									<Box sx={{ mt: 3, p: 2, backgroundColor: alpha('#000', 0.03), borderRadius: 2 }}>
										<Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
											{t('Current Tracking Status:')}
										</Typography>
										<TrackingStatus barcode={selectedOrder.tracking_number} />
									</Box>
								)}
							</>
						)}
					</DialogContent>
					<DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
						<Button
							onClick={handleCloseTrackingDialog}
							variant='outlined'
							size='large'
							sx={{
								borderColor: '#757575',
								color: '#757575',
								borderRadius: '12px',
								px: 4,
								py: 1.5,
								fontWeight: 600,
								textTransform: 'none',
								minWidth: 120,
								'&:hover': {
									borderColor: '#424242',
									color: '#424242',
									backgroundColor: 'rgba(117, 117, 117, 0.1)'
								}
							}}
						>
							{t('Cancel')}
						</Button>
						<Button
							onClick={handleUpdateTracking}
							variant='contained'
							size='large'
							disabled={trackingLoading}
							sx={{
								backgroundColor: '#1976d2',
								color: 'white',
								borderRadius: '12px',
								px: 4,
								py: 1.5,
								fontWeight: 600,
								textTransform: 'none',
								minWidth: 120,
								boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
								'&:hover': {
									backgroundColor: '#1565c0',
									boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
									transform: 'translateY(-2px)'
								}
							}}
						>
							{trackingLoading ? t('Updating...') : t('Update Tracking')}
						</Button>
					</DialogActions>
				</Dialog>

				{/* Confirm Payment Dialog */}
				<Dialog
					open={confirmPaymentDialogOpen}
					onClose={handleCloseConfirmPaymentDialog}
					maxWidth='sm'
					fullWidth
					PaperProps={{
						sx: {
							borderRadius: '16px',
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
						}
					}}
				>
					<DialogTitle
						sx={{
							background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
							color: 'white',
							fontWeight: 'bold',
							py: 3,
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 2,
							position: 'relative'
						}}
					>
						<ConfirmIcon sx={{ fontSize: 28 }} />
						{t('Confirm Payment')}
						<IconButton
							onClick={handleCloseConfirmPaymentDialog}
							sx={{
								position: 'absolute',
								right: 8,
								top: '50%',
								transform: 'translateY(-50%)',
								color: 'white',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.1)'
								}
							}}
						>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
					<DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
						{selectedOrder && (
							<>
								<Typography variant='h6' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
									{t('Order')} #{selectedOrder.invoice_no}
								</Typography>
								<Box sx={{ mb: 3, p: 3, backgroundColor: alpha('#000', 0.03), borderRadius: 2 }}>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<Typography variant='body2' color='text.secondary'>
												{t('Customer')}:
											</Typography>
											<Typography variant='body1' sx={{ fontWeight: 600 }}>
												{selectedOrder.first_name} {selectedOrder.last_name}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant='body2' color='text.secondary'>
												{t('Email')}:
											</Typography>
											<Typography variant='body1' sx={{ fontWeight: 600 }}>
												{selectedOrder.email || 'N/A'}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant='body2' color='text.secondary'>
												{t('Total Amount')}:
											</Typography>
											<Typography variant='body1' sx={{ fontWeight: 600, color: '#1976d2' }}>
												฿
												{parseFloat(selectedOrder.total_amount).toLocaleString('th-TH', {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												})}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant='body2' color='text.secondary'>
												{t('Payment Method')}:
											</Typography>
											<Typography variant='body1' sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
												{selectedOrder.payment_method}
											</Typography>
										</Grid>
									</Grid>
								</Box>
								<Typography variant='body2' color='text.secondary' sx={{ mb: 3, lineHeight: 1.6, textAlign: 'center' }}>
									{t(
										'This will send a confirmation email to the customer notifying them that their payment has been confirmed and their order is being prepared for shipment.'
									)}
								</Typography>
							</>
						)}
					</DialogContent>
					<DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
						<Button
							onClick={handleCloseConfirmPaymentDialog}
							variant='outlined'
							size='large'
							sx={{
								borderColor: '#757575',
								color: '#757575',
								borderRadius: '12px',
								px: 4,
								py: 1.5,
								fontWeight: 600,
								textTransform: 'none',
								minWidth: 120,
								'&:hover': {
									borderColor: '#424242',
									color: '#424242',
									backgroundColor: 'rgba(117, 117, 117, 0.1)'
								}
							}}
						>
							{t('Cancel')}
						</Button>
						<Button
							onClick={handleConfirmPayment}
							variant='contained'
							size='large'
							disabled={isConfirmingPayment}
							startIcon={<EmailIcon />}
							sx={{
								backgroundColor: '#2e7d32',
								color: 'white',
								borderRadius: '12px',
								px: 4,
								py: 1.5,
								fontWeight: 600,
								textTransform: 'none',
								minWidth: 120,
								boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
								'&:hover': {
									backgroundColor: '#1b5e20',
									boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
									transform: 'translateY(-2px)'
								}
							}}
						>
							{isConfirmingPayment ? t('Sending Email...') : t('Send Confirmation Email')}
						</Button>
					</DialogActions>
				</Dialog>

				{/* Mark as Completed Dialog */}
				<Dialog
					open={markCompletedDialogOpen}
					onClose={handleCloseMarkCompletedDialog}
					maxWidth='sm'
					fullWidth
					PaperProps={{
						sx: {
							borderRadius: '16px',
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
						}
					}}
				>
					<DialogTitle
						sx={{
							background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
							color: 'white',
							fontWeight: 'bold',
							py: 3,
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 2,
							position: 'relative'
						}}
					>
						<CheckCircleIcon sx={{ fontSize: 28 }} />
						{t('Mark Order as Completed')}
						<IconButton
							onClick={handleCloseMarkCompletedDialog}
							sx={{
								position: 'absolute',
								right: 8,
								top: '50%',
								transform: 'translateY(-50%)',
								color: 'white',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.1)'
								}
							}}
						>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
					<DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
						{selectedOrder && (
							<>
								<Typography variant='h6' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
									{t('Order')} #{selectedOrder.invoice_no}
								</Typography>
								<Box sx={{ mb: 3, p: 3, backgroundColor: alpha('#000', 0.03), borderRadius: 2 }}>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<Typography variant='body2' color='text.secondary'>
												{t('Customer')}
											</Typography>
											<Typography variant='body1' sx={{ fontWeight: 600 }}>
												{selectedOrder.first_name} {selectedOrder.last_name}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant='body2' color='text.secondary'>
												{t('Current Status:')}
											</Typography>
											<Typography variant='body1' sx={{ fontWeight: 600 }}>
												{selectedOrder.order_status}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant='body2' color='text.secondary'>
												{t('Tracking Number:')}
											</Typography>
											<Typography variant='body1' sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
												{selectedOrder.tracking_number || 'N/A'}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant='body2' color='text.secondary'>
												{t('Total Amount:')}
											</Typography>
											<Typography variant='body1' sx={{ fontWeight: 600, color: '#1976d2' }}>
												฿
												{parseFloat(selectedOrder.total_amount).toLocaleString('th-TH', {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												})}
											</Typography>
										</Grid>
									</Grid>
								</Box>
								<Alert severity='info' sx={{ mb: 2 }}>
									<Typography variant='body2' sx={{ lineHeight: 1.6 }}>
										{t(
											'This will mark the order as "Completed" and move it to the Completed section. This action indicates that the order has been successfully delivered to the customer.'
										)}
									</Typography>
								</Alert>
								<Typography variant='body2' color='text.secondary' sx={{ mb: 3, lineHeight: 1.6, textAlign: 'center' }}>
									{t('Are you sure you want to mark this order as completed?')}
								</Typography>
							</>
						)}
					</DialogContent>
					<DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
						<Button
							onClick={handleCloseMarkCompletedDialog}
							variant='outlined'
							size='large'
							sx={{
								borderColor: '#757575',
								color: '#757575',
								borderRadius: '12px',
								px: 4,
								py: 1.5,
								fontWeight: 600,
								textTransform: 'none',
								minWidth: 120,
								'&:hover': {
									borderColor: '#424242',
									color: '#424242',
									backgroundColor: 'rgba(117, 117, 117, 0.1)'
								}
							}}
						>
							{t('Cancel')}
						</Button>
						<Button
							onClick={handleMarkAsCompleted}
							variant='contained'
							size='large'
							disabled={isMarkingCompleted}
							startIcon={<CheckCircleIcon />}
							sx={{
								backgroundColor: '#1b5e20',
								color: 'white',
								borderRadius: '12px',
								px: 4,
								py: 1.5,
								fontWeight: 600,
								textTransform: 'none',
								minWidth: 120,
								boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)',
								'&:hover': {
									backgroundColor: '#2e7d32',
									boxShadow: '0 6px 16px rgba(27, 94, 32, 0.4)',
									transform: 'translateY(-2px)'
								}
							}}
						>
							{isMarkingCompleted ? t('Marking as Completed...') : t('Mark as Completed')}
						</Button>
					</DialogActions>
				</Dialog>

				{/* Snackbar for notifications */}
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={5000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				>
					<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant='filled' sx={{ width: '100%' }}>
						{snackbarMessage}
					</Alert>
				</Snackbar>
			</Paper>
		</Box>
	);
}

export default OrdersTable;
