// import React, { useEffect, useState, useMemo } from 'react';
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	Paper,
// 	Typography,
// 	Avatar,
// 	Button,
// 	Dialog,
// 	DialogActions,
// 	DialogContent,
// 	DialogTitle,
// 	TextField,
// 	Box,
// 	TablePagination,
// 	Chip,
// 	IconButton,
// 	Switch,
// 	FormControlLabel,
// 	Alert,
// 	Snackbar,
// 	CircularProgress,
// 	InputAdornment,
// 	MenuItem,
// 	Select,
// 	FormControl,
// 	InputLabel
// } from '@mui/material';
// import {
// 	Edit as EditIcon,
// 	Delete as DeleteIcon,
// 	Refresh as RefreshIcon,
// 	Add as AddIcon,
// 	Search as SearchIcon,
// 	Visibility as VisibilityIcon,
// 	TrendingUp as TrendingUpIcon,
// 	Category as CategoryIcon,
// 	CheckCircle as CheckCircleIcon,
// 	Block as BlockIcon,
// 	SortByAlpha as SortIcon,
// 	FolderOpen as FolderOpenIcon,
// 	SearchOff as SearchOffIcon,
// 	CloudUpload as CloudUploadIcon,
// 	Image as ImageIcon,
// 	ArrowUpward as ArrowUpwardIcon,
// 	ArrowDownward as ArrowDownwardIcon,
// 	Warning as WarningIcon
// } from '@mui/icons-material';
// import Link from '@fuse/core/Link';
// import MultiLanguageField from './MultiLanguageField';
// import useI18n from '@i18n/useI18n';
// import { useTranslation } from 'react-i18next';


// interface SolutionCategory {
// 	category_id: number;
// 	translation_id: number;
// 	lang: string;
// 	name: string;
// 	description: string;
// 	image_url: string;
// 	active: number;
// 	created_at?: string;
// 	updated_at?: string;
// 	content_count?: number;
// }

// interface ContentDetail {
// 	content_id: number;
// 	solution_id: number;
// 	lang: string;
// 	title: string;
// 	content: string;
// 	content_order: number;
// 	image_url: string;
// 	created_at: string;
// 	updated_at: string;
// }

// type SortField = 'name' | 'category_id' | 'created_at';
// type SortDirection = 'asc' | 'desc';
// type StatusFilter = 'all' | 'active' | 'inactive';

// const SolutionCategoriesTable: React.FC = () => {
// 	const { language } = useI18n();
// 	const currentLang = language.id; // 'en' or 'th'
// 	const { t } = useTranslation('SolutionPage');

// 	const [rawCategories, setRawCategories] = useState<SolutionCategory[]>([]);
// 	const [filteredCategories, setFilteredCategories] = useState<SolutionCategory[]>([]);
// 	const [editCategory, setEditCategory] = useState<SolutionCategory | null>(null);
// 	const [newCategory, setNewCategory] = useState<{
// 		name: string;
// 		name_en: string;
// 		description: string;
// 		description_en: string;
// 		image_url: string;
// 		active: boolean;
// 	} | null>(null);
// 	const [page, setPage] = useState(0);
// 	const [rowsPerPage, setRowsPerPage] = useState(10);
// 	const [loading, setLoading] = useState(false);
// 	const [searchTerm, setSearchTerm] = useState('');
// 	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
// 	const [sortField, setSortField] = useState<SortField>('name');
// 	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
// 	const [viewCategory, setViewCategory] = useState<SolutionCategory | null>(null);
// 	const [contentDetails, setContentDetails] = useState<ContentDetail[]>([]);
// 	const [loadingContent, setLoadingContent] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const [uploadingImage, setUploadingImage] = useState(false);
// 	const [deleteCategory, setDeleteCategory] = useState<SolutionCategory | null>(null);

// 	const [snackbar, setSnackbar] = useState({
// 		open: false,
// 		message: '',
// 		severity: 'success' as 'success' | 'error' | 'info' | 'warning'
// 	});

// 	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 	// ฟังก์ชันกรองข้อมูลตามภาษา - แสดงเฉพาะ category_id ที่ไม่ซ้ำ และเลือกภาษาที่ตรงกับที่ใช้งาน
// 	const categories = useMemo(() => {
// 		const categoryMap = new Map<number, SolutionCategory>();

// 		rawCategories.forEach((cat) => {
// 			const existingCat = categoryMap.get(cat.category_id);

// 			if (!existingCat) {
// 				categoryMap.set(cat.category_id, cat);
// 			} else if (cat.lang === currentLang) {
// 				categoryMap.set(cat.category_id, cat);
// 			}
// 		});

// 		return Array.from(categoryMap.values()).sort((a, b) => a.category_id - b.category_id);
// 	}, [rawCategories, currentLang]);

// 	const fetchCategories = async () => {
// 		setLoading(true);
// 		setError(null);
// 		try {
// 			const response = await fetch(`${API_BASE_URL}/solution-categories/`);

// 			if (!response.ok) {
// 				throw new Error(`Server returned ${response.status}`);
// 			}

// 			const data = await response.json();
// 			setRawCategories(data);
// 		} catch (error) {
// 			console.error('Error fetching categories:', error);
// 			setError('Failed to load categories');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const fetchContentDetails = async (solutionId: number, currentLang: string) => {
// 		setLoadingContent(true);
// 		try {
// 			const response = await fetch(`${API_BASE_URL}/solution-content/`);
// 			const data = await response.json();

// 			// กรองตาม solution_id + lang
// 			const filtered = data.filter(
// 				(item: ContentDetail) => item.solution_id === solutionId && item.lang === currentLang
// 			);

// 			setContentDetails(filtered);
// 		} catch (error) {
// 			console.error('Error fetching content details:', error);
// 			setContentDetails([]);
// 		} finally {
// 			setLoadingContent(false);
// 		}
// 	};

// 	const handleImageUpload = async (file: File): Promise<string | null> => {
// 		setUploadingImage(true);
// 		setError(null);

// 		try {
// 			const formData = new FormData();
// 			formData.append('file', file);

// 			const response = await fetch(`${API_BASE_URL}/uploads/`, {
// 				method: 'POST',
// 				body: formData
// 			});

// 			if (!response.ok) {
// 				throw new Error('Failed to upload image');
// 			}

// 			const data = await response.json();

// 			let imageUrl = null;

// 			if (data.url) {
// 				imageUrl = data.url;
// 			} else if (data.file_url) {
// 				imageUrl = data.file_url;
// 			} else if (data.image_url) {
// 				imageUrl = data.image_url;
// 			} else if (data.path) {
// 				imageUrl = `${import.meta.env.VITE_IMAGE_URL || API_BASE_URL}${data.path}`;
// 			} else if (data.filename) {
// 				imageUrl = `${import.meta.env.VITE_IMAGE_URL || API_BASE_URL}/uploads/${data.filename}`;
// 			} else if (typeof data === 'string') {
// 				imageUrl = data;
// 			} else {
// 				const responseString = JSON.stringify(data);
// 				const urlMatch = responseString.match(/https?:\/\/[^\s"]+/);

// 				if (urlMatch) {
// 					imageUrl = urlMatch[0];
// 				}
// 			}

// 			if (!imageUrl) {
// 				console.error('No valid image URL found in response:', data);
// 				throw new Error('Invalid response format from upload API');
// 			}

// 			setSnackbar({
// 				open: true,
// 				message: t('Image uploaded successfully'),
// 				severity: 'success'
// 			});

// 			return imageUrl;
// 		} catch (error) {
// 			console.error('Error uploading image:', error);
// 			setError('Failed to upload image');
// 			setSnackbar({
// 				open: true,
// 				message: 'Failed to upload image',
// 				severity: 'error'
// 			});
// 			return null;
// 		} finally {
// 			setUploadingImage(false);
// 		}
// 	};

// 	// Filter and sort categories
// 	useEffect(() => {
// 		let result = [...categories];

// 		if (searchTerm) {
// 			result = result.filter(
// 				(category) =>
// 					category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// 					category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
// 					category.category_id.toString().includes(searchTerm)
// 			);
// 		}

// 		if (statusFilter !== 'all') {
// 			result = result.filter((category) =>
// 				statusFilter === 'active' ? category.active === 1 : category.active === 0
// 			);
// 		}

// 		result.sort((a, b) => {
// 			let aValue: any = a[sortField];
// 			let bValue: any = b[sortField];

// 			if (sortField === 'created_at') {
// 				aValue = new Date(aValue || 0).getTime();
// 				bValue = new Date(bValue || 0).getTime();
// 			} else if (typeof aValue === 'string') {
// 				aValue = aValue.toLowerCase();
// 				bValue = bValue.toLowerCase();
// 			}

// 			if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;

// 			if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;

// 			return 0;
// 		});

// 		setFilteredCategories(result);
// 		setPage(0);
// 	}, [categories, searchTerm, statusFilter, sortField, sortDirection]);

// 	useEffect(() => {
// 		fetchCategories();
// 	}, []);

// 	// const handleSaveEdit = async () => {
// 	// 	if (!editCategory?.name.trim()) {
// 	// 		setError('Category name is required');
// 	// 		return;
// 	// 	}

// 	// 	setLoading(true);
// 	// 	setError(null);

// 	// 	try {
// 	// 		const response = await fetch(`${API_BASE_URL}/solution-categories/${editCategory.category_id}`, {
// 	// 			method: 'PUT',
// 	// 			headers: { 'Content-Type': 'application/json' },
// 	// 			body: JSON.stringify(editCategory)
// 	// 		});

// 	// 		if (!response.ok) {
// 	// 			throw new Error('Failed to update category');
// 	// 		}

// 	// 		fetchCategories();
// 	// 		setSnackbar({
// 	// 			open: true,
// 	// 			message: 'Category updated successfully',
// 	// 			severity: 'success'
// 	// 		});
// 	// 		setEditCategory(null);
// 	// 	} catch (error) {
// 	// 		setError('Failed to update category');
// 	// 	} finally {
// 	// 		setLoading(false);
// 	// 	}
// 	// };

// 	const handleSaveEdit = async () => {
// 		if (!editCategory?.name?.trim()) {
// 			setError(t('Category name is required'));
// 			return;
// 		}

// 		setLoading(true);
// 		setError(null);

// 		try {
// 			// ✅ เลือกส่งเฉพาะ field ที่จะอัปเดต
// 			const payload: any = {};

// 			if (editCategory.name) payload.name = editCategory.name;

// 			if (editCategory.description) payload.description = editCategory.description;

// 			if (editCategory.image_url) payload.image_url = editCategory.image_url;

// 			if (editCategory.active !== undefined) payload.active = editCategory.active;

// 			const response = await fetch(
// 				`${API_BASE_URL}/solution-categories/${editCategory.category_id}/${editCategory.translation_id}`,
// 				{
// 					method: 'PUT',
// 					headers: { 'Content-Type': 'application/json' },
// 					body: JSON.stringify(payload)
// 				}
// 			);

// 			if (!response.ok) {
// 				throw new Error('Failed to update category');
// 			}

// 			fetchCategories();
// 			setSnackbar({
// 				open: true,
// 				message: t('Category updated successfully'),
// 				severity: 'success'
// 			});
// 			setEditCategory(null);
// 		} catch (error) {
// 			setError('Failed to update category');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleSaveNew = async () => {
// 		if (!newCategory?.name.trim()) {
// 			setError(t('Category name is required'));
// 			return;
// 		}

// 		setLoading(true);
// 		setError(null);

// 		try {
// 			const response = await fetch(`${API_BASE_URL}/solution-categories/`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify(newCategory)
// 			});

// 			if (!response.ok) {
// 				throw new Error('Failed to create category');
// 			}

// 			fetchCategories();
// 			setSnackbar({
// 				open: true,
// 				message: t('Category created successfully'),
// 				severity: 'success'
// 			});

// 			setNewCategory(null);
// 		} catch (error) {
// 			setError('Failed to create category');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleDelete = async () => {
// 		if (!deleteCategory) return;

// 		setLoading(true);
// 		setError(null);

// 		try {
// 			const response = await fetch(`${API_BASE_URL}/solution-categories/${deleteCategory.category_id}`, {
// 				method: 'DELETE'
// 			});

// 			if (!response.ok) {
// 				throw new Error('Failed to delete category');
// 			}

// 			fetchCategories();
// 			setSnackbar({
// 				open: true,
// 				message: `"${deleteCategory.name}" ${t('deleted successfully')}`,
// 				severity: 'success'
// 			});
// 			setDeleteCategory(null);
// 		} catch (error) {
// 			setError('Failed to delete category');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleChangePage = (event: unknown, newPage: number) => {
// 		setPage(newPage);
// 	};

// 	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
// 		setRowsPerPage(parseInt(event.target.value, 10));
// 		setPage(0);
// 	};

// 	const handleCloseSnackbar = () => {
// 		setSnackbar({ ...snackbar, open: false });
// 	};

// 	const getCategoryInitials = (name: string) => {
// 		return name
// 			.split(' ')
// 			.map((word) => word[0])
// 			.join('')
// 			.toUpperCase()
// 			.substring(0, 2);
// 	};

// 	const formatDate = (dateString?: string) => {
// 		if (!dateString) return '-';

// 		return new Date(dateString).toLocaleDateString();
// 	};

// 	const handleSort = (field: SortField) => {
// 		if (sortField === field) {
// 			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
// 		} else {
// 			setSortField(field);
// 			setSortDirection('asc');
// 		}
// 	};

// 	const getSortIcon = (field: SortField) => {
// 		if (sortField !== field) {
// 			return <SortIcon sx={{ fontSize: 16, opacity: 0.3 }} />;
// 		}

// 		return sortDirection === 'asc' ? (
// 			<ArrowUpwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
// 		) : (
// 			<ArrowDownwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
// 		);
// 	};

// 	const ImageUploadSection = ({
// 		imageUrl,
// 		onImageChange,
// 		label = t('Category Image')
// 	}: {
// 		imageUrl: string;
// 		onImageChange: (url: string) => void;
// 		label?: string;
// 	}) => {
// 		const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
// 			const file = event.target.files?.[0];

// 			if (!file) return;

// 			if (!file.type.startsWith('image/')) {
// 				setSnackbar({
// 					open: true,
// 					message: t('Please select a valid image file (PNG, JPG, JPEG, GIF, WebP)'),
// 					severity: 'error'
// 				});
// 				return;
// 			}

// 			if (file.size > 10 * 1024 * 1024) {
// 				setSnackbar({
// 					open: true,
// 					message: t('File size must be less than 10MB'),
// 					severity: 'error'
// 				});
// 				return;
// 			}

// 			const uploadedUrl = await handleImageUpload(file);

// 			if (uploadedUrl) {
// 				onImageChange(uploadedUrl);
// 			}

// 			event.target.value = '';
// 		};

// 		const getFullImageUrl = (url: string): string => {
// 			if (!url) return '';

// 			if (url.startsWith('http://') || url.startsWith('https://')) {
// 				return url;
// 			}

// 			if (url.startsWith('/')) {
// 				return `${import.meta.env.VITE_IMAGE_URL || API_BASE_URL}${url}`;
// 			}

// 			return `${import.meta.env.VITE_IMAGE_URL || API_BASE_URL}/${url}`;
// 		};

// 		const fullImageUrl = getFullImageUrl(imageUrl);

// 		return (
// 			<Box sx={{ mb: 2 }}>
// 				<Typography
// 					variant='subtitle2'
// 					sx={{ mb: 1, fontWeight: 600 }}
// 				>
// 					{label}
// 				</Typography>

// 				{imageUrl && (
// 					<Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
// 						<Avatar
// 							src={fullImageUrl}
// 							sx={{
// 								width: 80,
// 								height: 80,
// 								borderRadius: 2,
// 								boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
// 							}}
// 							onError={(e) => {
// 								console.error('Image failed to load:', fullImageUrl);
// 								const target = e.target as HTMLImageElement;
// 								target.style.display = 'none';
// 							}}
// 						>
// 							<ImageIcon />
// 						</Avatar>
// 						<Box>
// 							<Typography
// 								variant='body2'
// 								color='text.secondary'
// 							>
// 								{t('Current image')}
// 							</Typography>
// 							<Typography
// 								variant='caption'
// 								sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem', color: 'text.disabled' }}
// 							>
// 								{fullImageUrl}
// 							</Typography>
// 							<Button
// 								size='small'
// 								onClick={() => onImageChange('')}
// 								sx={{ mt: 0.5, textTransform: 'none' }}
// 							>
// 								{t('Remove image')}
// 							</Button>
// 						</Box>
// 					</Box>
// 				)}

// 				<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
// 					<Button
// 						component='label'
// 						variant='outlined'
// 						startIcon={<CloudUploadIcon />}
// 						disabled={uploadingImage}
// 						sx={{
// 							textTransform: 'none',
// 							borderRadius: 2,
// 							flex: 1
// 						}}
// 					>
// 						{uploadingImage ? t('Uploading...') : t('Upload Image')}
// 						<input
// 							type='file'
// 							hidden
// 							accept='image/*'
// 							onChange={handleFileSelect}
// 						/>
// 					</Button>

// 					{uploadingImage && <CircularProgress size={24} />}
// 				</Box>

// 				<TextField
// 					label={t('Or enter image URL manually')}
// 					fullWidth
// 					value={imageUrl}
// 					onChange={(e) => onImageChange(e.target.value)}
// 					size='small'
// 					sx={{
// 						mt: 2,
// 						'& .MuiOutlinedInput-root': {
// 							borderRadius: 2
// 						}
// 					}}
// 					placeholder='https://example.com/image.jpg'
// 					helperText={t('Upload a file above or paste an image URL here')}
// 				/>
// 			</Box>
// 		);
// 	};

// 	const stats = {
// 		total: categories.length,
// 		active: categories.filter((cat) => cat.active === 1).length,
// 		inactive: categories.filter((cat) => cat.active === 0).length
// 	};

// 	return (
// 		<Box
// 			sx={{
// 				p: { xs: 2, sm: 3, md: 4 },
// 				background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
// 				minHeight: '100vh'
// 			}}
// 		>
// 			{/* Header */}
// 			<Box sx={{ mb: 4 }}>
// 				<Typography
// 					variant='h3'
// 					component='h1'
// 					sx={{
// 						fontWeight: 700,
// 						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// 						backgroundClip: 'text',
// 						textFillColor: 'transparent',
// 						WebkitBackgroundClip: 'text',
// 						WebkitTextFillColor: 'transparent',
// 						mb: 1
// 					}}
// 				>
// 					{t('Solution Categories')}
// 				</Typography>
// 				<Typography
// 					variant='h6'
// 					color='text.secondary'
// 					sx={{ fontWeight: 400 }}
// 				>
// 					{t('Manage and organize your solution categories with ease • Language')}: {currentLang.toUpperCase()}
// 				</Typography>
// 			</Box>

// 			{/* Stats Cards */}
// 			<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
// 				<Paper
// 					elevation={2}
// 					sx={{
// 						p: 3,
// 						borderRadius: 3,
// 						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// 						color: 'white',
// 						position: 'relative',
// 						overflow: 'hidden',
// 						'&::before': {
// 							content: '""',
// 							position: 'absolute',
// 							top: 0,
// 							right: 0,
// 							width: '30%',
// 							height: '100%',
// 							background: 'rgba(255,255,255,0.1)',
// 							borderRadius: '0 0 0 100px'
// 						}
// 					}}
// 				>
// 					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
// 						<Typography
// 							variant='h4'
// 							sx={{ fontWeight: 700 }}
// 						>
// 							{stats.total}
// 						</Typography>
// 						<CategoryIcon sx={{ fontSize: 32, opacity: 0.8 }} />
// 					</Box>
// 					<Typography
// 						variant='body1'
// 						sx={{ opacity: 0.9, fontWeight: 500 }}
// 					>
// 						{t('Total Categories')}
// 					</Typography>
// 				</Paper>

// 				<Paper
// 					elevation={2}
// 					sx={{
// 						p: 3,
// 						borderRadius: 3,
// 						background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
// 						color: 'white',
// 						position: 'relative',
// 						overflow: 'hidden',
// 						'&::before': {
// 							content: '""',
// 							position: 'absolute',
// 							top: 0,
// 							right: 0,
// 							width: '30%',
// 							height: '100%',
// 							background: 'rgba(255,255,255,0.1)',
// 							borderRadius: '0 0 0 100px'
// 						}
// 					}}
// 				>
// 					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
// 						<Typography
// 							variant='h4'
// 							sx={{ fontWeight: 700 }}
// 						>
// 							{stats.active}
// 						</Typography>
// 						<CheckCircleIcon sx={{ fontSize: 32, opacity: 0.8 }} />
// 					</Box>
// 					<Typography
// 						variant='body1'
// 						sx={{ opacity: 0.9, fontWeight: 500 }}
// 					>
// 						{t('Active Categories')}
// 					</Typography>
// 				</Paper>

// 				<Paper
// 					elevation={2}
// 					sx={{
// 						p: 3,
// 						borderRadius: 3,
// 						background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
// 						color: 'white',
// 						position: 'relative',
// 						overflow: 'hidden',
// 						'&::before': {
// 							content: '""',
// 							position: 'absolute',
// 							top: 0,
// 							right: 0,
// 							width: '30%',
// 							height: '100%',
// 							background: 'rgba(255,255,255,0.1)',
// 							borderRadius: '0 0 0 100px'
// 						}
// 					}}
// 				>
// 					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
// 						<Typography
// 							variant='h4'
// 							sx={{ fontWeight: 700 }}
// 						>
// 							{stats.inactive}
// 						</Typography>
// 						<BlockIcon sx={{ fontSize: 32, opacity: 0.8 }} />
// 					</Box>
// 					<Typography
// 						variant='body1'
// 						sx={{ opacity: 0.9, fontWeight: 500 }}
// 					>
// 						{t('Inactive Categories')}
// 					</Typography>
// 				</Paper>

// 				<Paper
// 					elevation={2}
// 					sx={{
// 						p: 3,
// 						borderRadius: 3,
// 						background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
// 						color: '#333',
// 						position: 'relative',
// 						overflow: 'hidden',
// 						'&::before': {
// 							content: '""',
// 							position: 'absolute',
// 							top: 0,
// 							right: 0,
// 							width: '30%',
// 							height: '100%',
// 							background: 'rgba(255,255,255,0.3)',
// 							borderRadius: '0 0 0 100px'
// 						}
// 					}}
// 				>
// 					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
// 						<Typography
// 							variant='h4'
// 							sx={{ fontWeight: 700 }}
// 						>
// 							{filteredCategories.length}
// 						</Typography>
// 						<TrendingUpIcon sx={{ fontSize: 32, opacity: 0.7 }} />
// 					</Box>
// 					<Typography
// 						variant='body1'
// 						sx={{ opacity: 0.8, fontWeight: 500 }}
// 					>
// 						{searchTerm || statusFilter !== t('all') ? t('Search Results') : t('Total Showing')}
// 					</Typography>
// 				</Paper>
// 			</Box>

// 			{/* Controls */}
// 			<Paper
// 				elevation={1}
// 				sx={{
// 					p: 3,
// 					mb: 3,
// 					borderRadius: 3,
// 					border: '1px solid rgba(0, 0, 0, 0.05)',
// 					backgroundColor: 'rgba(255, 255, 255, 0.8)',
// 					backdropFilter: 'blur(10px)'
// 				}}
// 			>
// 				<Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
// 					<TextField
// 						placeholder={t('Search categories...')}
// 						value={searchTerm}
// 						onChange={(e) => setSearchTerm(e.target.value)}
// 						size='small'
// 						sx={{
// 							minWidth: 320,
// 							flex: 1,
// 							maxWidth: 400,
// 							'& .MuiOutlinedInput-root': {
// 								borderRadius: 2,
// 								backgroundColor: 'white',
// 								'&:hover': {
// 									'& .MuiOutlinedInput-notchedOutline': {
// 										borderColor: 'primary.main'
// 									}
// 								}
// 							}
// 						}}
// 						InputProps={{
// 							startAdornment: (
// 								<InputAdornment position='start'>
// 									<SearchIcon sx={{ color: 'text.secondary' }} />
// 								</InputAdornment>
// 							)
// 						}}
// 					/>

// 					<FormControl
// 						size='small'
// 						sx={{
// 							minWidth: 140,
// 							'& .MuiOutlinedInput-root': {
// 								borderRadius: 2,
// 								backgroundColor: 'white'
// 							}
// 						}}
// 					>
// 						<InputLabel>{t('Status')}</InputLabel>
// 						<Select
// 							value={statusFilter}
// 							label={t('Status')}
// 							onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
// 						>
// 							<MenuItem value='all'>{t('All Status')}</MenuItem>
// 							<MenuItem value='active'>{t('Active')}</MenuItem>
// 							<MenuItem value='inactive'>{t('Inactive')}</MenuItem>
// 						</Select>
// 					</FormControl>

// 					<FormControl
// 						size='small'
// 						sx={{
// 							minWidth: 140,
// 							'& .MuiOutlinedInput-root': {
// 								borderRadius: 2,
// 								backgroundColor: 'white'
// 							}
// 						}}
// 					>
// 						<InputLabel>{t('Sort By')}</InputLabel>
// 						<Select
// 							value={sortField}
// 							label={t('Sort By')}
// 							onChange={(e) => setSortField(e.target.value as SortField)}
// 						>
// 							<MenuItem value='name'>{t('Name')}</MenuItem>
// 							<MenuItem value='category_id'>{t('ID')}</MenuItem>
// 							{/* <MenuItem value='created_at'>{t('Created Date')}</MenuItem> */}
// 						</Select>
// 					</FormControl>

// 					<Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
// 						<Button
// 							variant='outlined'
// 							startIcon={<RefreshIcon />}
// 							onClick={fetchCategories}
// 							disabled={loading}
// 							sx={{
// 								borderRadius: 2,
// 								px: 2.5,
// 								py: 1,
// 								textTransform: 'none',
// 								fontWeight: 600,
// 								borderColor: 'rgba(0, 0, 0, 0.12)',
// 								color: 'text.primary',
// 								'&:hover': {
// 									borderColor: 'primary.main',
// 									backgroundColor: 'rgba(25, 118, 210, 0.04)'
// 								}
// 							}}
// 						>
// 							{t('Refresh')}
// 						</Button>
// 						<Button
// 							variant='contained'
// 							startIcon={<AddIcon />}
// 							onClick={() =>
// 								setNewCategory({
// 									name: '',
// 									name_en: '',
// 									description: '',
// 									description_en: '',
// 									image_url: '',
// 									active: true
// 								})
// 							}
// 							sx={{
// 								borderRadius: 2,
// 								px: 3,
// 								py: 1,
// 								textTransform: 'none',
// 								fontWeight: 600,
// 								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// 								boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
// 								'&:hover': {
// 									background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
// 									boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
// 									transform: 'translateY(-1px)'
// 								}
// 							}}
// 						>
// 							{t('Add Category')}
// 						</Button>
// 					</Box>
// 				</Box>
// 			</Paper>

// 			{/* Table */}
// 			<Paper
// 				elevation={2}
// 				sx={{
// 					width: '100%',
// 					overflow: 'hidden',
// 					borderRadius: 3,
// 					border: '1px solid rgba(0, 0, 0, 0.05)'
// 				}}
// 			>
// 				{error && (
// 					<Alert
// 						severity='error'
// 						sx={{ m: 2 }}
// 						action={
// 							<Button
// 								color='inherit'
// 								size='small'
// 								onClick={fetchCategories}
// 							>
// 								{t('Retry')}
// 							</Button>
// 						}
// 					>
// 						{error}
// 					</Alert>
// 				)}

// 				<TableContainer>
// 					<Table sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid rgba(224, 224, 224, 0.5)' } }}>
// 						<TableHead>
// 							<TableRow
// 								sx={{
// 									backgroundColor: 'rgba(0, 0, 0, 0.02)',
// 									'& .MuiTableCell-head': {
// 										fontWeight: 600,
// 										color: '#1a1a1a',
// 										textTransform: 'uppercase',
// 										fontSize: '1.2rem',
// 										letterSpacing: '0.5px',
// 										py: 2.5
// 									}
// 								}}
// 							>
// 								<TableCell sx={{ pl: 3 }}>
// 									<Box
// 										sx={{
// 											display: 'flex',
// 											alignItems: 'center',
// 											gap: 1,
// 											cursor: 'pointer',
// 											userSelect: 'none',
// 											'&:hover': {
// 												color: 'primary.main'
// 											}
// 										}}
// 										onClick={() => handleSort('category_id')}
// 									>
// 										{t('ID')}
// 										{getSortIcon('category_id')}
// 									</Box>
// 								</TableCell>
// 								<TableCell>
// 									<Box
// 										sx={{
// 											display: 'flex',
// 											alignItems: 'center',
// 											gap: 1,
// 											cursor: 'pointer',
// 											userSelect: 'none',
// 											'&:hover': {
// 												color: 'primary.main'
// 											}
// 										}}
// 										onClick={() => handleSort('name')}
// 									>
// 										{t('Category')}
// 										{getSortIcon('name')}
// 									</Box>
// 								</TableCell>
// 								<TableCell sx={{ color: '#1a1a1a' }}>{t('Description')}</TableCell>
// 								<TableCell sx={{ color: '#1a1a1a' }}>{t('Status')}</TableCell>
// 								{/* <TableCell>
// 									<Box
// 										sx={{
// 											display: 'flex',
// 											alignItems: 'center',
// 											gap: 1,
// 											cursor: 'pointer',
// 											userSelect: 'none',
// 											'&:hover': {
// 												color: 'primary.main'
// 											}
// 										}}
// 										onClick={() => handleSort('created_at')}
// 									>
// 										Created Date
// 										{getSortIcon('created_at')}
// 									</Box>
// 								</TableCell> */}
// 								<TableCell
// 									align='center'
// 									sx={{ pr: 3, color: '#1a1a1a' }}
// 								>
// 								{t('Actions')}
// 								</TableCell>
// 							</TableRow>
// 						</TableHead>
// 						<TableBody>
// 							{loading ? (
// 								<TableRow>
// 									<TableCell
// 										colSpan={6}
// 										align='center'
// 										sx={{
// 											height: 200,
// 											py: 0,
// 											textAlign: 'center',
// 											verticalAlign: 'middle'
// 										}}
// 									>
// 										<Box
// 											sx={{
// 												display: 'flex',
// 												flexDirection: 'column',
// 												alignItems: 'center',
// 												justifyContent: 'center',
// 												height: '100%',
// 												gap: 2
// 											}}
// 										>
// 											<CircularProgress
// 												size={48}
// 												thickness={4}
// 												sx={{ color: 'primary.main' }}
// 											/>
// 											<Box sx={{ textAlign: 'center' }}>
// 												<Typography
// 													variant='h6'
// 													sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}
// 												>
// 													{t('Loading Categories...')}
// 												</Typography>
// 												<Typography
// 													variant='body2'
// 													sx={{ color: '#666666' }}
// 												>
// 													{t('Please wait while we fetch your solution categories...')}
// 												</Typography>
// 											</Box>
// 										</Box>
// 									</TableCell>
// 								</TableRow>
// 							) : filteredCategories.length === 0 ? (
// 								<TableRow>
// 									<TableCell
// 										colSpan={6}
// 										align='center'
// 										sx={{ py: 8 }}
// 									>
// 										<Box
// 											sx={{
// 												display: 'flex',
// 												flexDirection: 'column',
// 												alignItems: 'center',
// 												gap: 3
// 											}}
// 										>
// 											{searchTerm || statusFilter !== 'all' ? (
// 												<Box
// 													sx={{
// 														display: 'flex',
// 														flexDirection: 'column',
// 														alignItems: 'center',
// 														gap: 2
// 													}}
// 												>
// 													<Box
// 														sx={{
// 															p: 3,
// 															borderRadius: '50%',
// 															backgroundColor: 'rgba(255, 193, 7, 0.1)',
// 															color: 'warning.main'
// 														}}
// 													>
// 														<SearchOffIcon sx={{ fontSize: 48 }} />
// 													</Box>
// 													<Box sx={{ textAlign: 'center' }}>
// 														<Typography
// 															variant='h6'
// 															sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}
// 														>
// 														{t('No Matching Categories Found')}
// 														</Typography>
// 														<Typography
// 															variant='body2'
// 															sx={{ mb: 2, color: '#666666' }}
// 														>
// 															{t('Try adjusting your search terms or filters to find what you looking for')}
// 														</Typography>
// 														<Button
// 															variant='outlined'
// 															size='small'
// 															onClick={() => {
// 																setSearchTerm('');
// 																setStatusFilter('all');
// 															}}
// 															sx={{
// 																textTransform: 'none',
// 																borderRadius: 2
// 															}}
// 														>
// 															{t('Clear Filters')}
// 														</Button>
// 													</Box>
// 												</Box>
// 											) : (
// 												<Box
// 													sx={{
// 														display: 'flex',
// 														flexDirection: 'column',
// 														alignItems: 'center',
// 														gap: 2
// 													}}
// 												>
// 													<Box
// 														sx={{
// 															p: 3,
// 															borderRadius: '50%',
// 															backgroundColor: 'rgba(25, 118, 210, 0.1)',
// 															color: 'primary.main'
// 														}}
// 													>
// 														<FolderOpenIcon sx={{ fontSize: 48 }} />
// 													</Box>
// 													<Box sx={{ textAlign: 'center' }}>
// 														<Typography
// 															variant='h6'
// 															sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}
// 														>
// 															{t('No Categories Yet')}
// 														</Typography>
// 														<Typography
// 															variant='body2'
// 															sx={{ mb: 2, color: '#666666' }}
// 														>
// 															{t('Get started by creating your first solution category to organize your content')}
// 														</Typography>
// 														<Button
// 															variant='contained'
// 															startIcon={<AddIcon />}
// 															onClick={() =>
// 																setNewCategory({
// 																	name: '',
// 																	name_en: '',
// 																	description: '',
// 																	description_en: '',
// 																	image_url: '',
// 																	active: true
// 																})
// 															}
// 															sx={{
// 																textTransform: 'none',
// 																borderRadius: 2,
// 																px: 3
// 															}}
// 														>
// 															{t('Create First Category')}
// 														</Button>
// 													</Box>
// 												</Box>
// 											)}
// 										</Box>
// 									</TableCell>
// 								</TableRow>
// 							) : (
// 								filteredCategories
// 									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// 									.map((category) => (
// 										<TableRow
// 											key={category.category_id}
// 											hover
// 											sx={{
// 												'&:hover': {
// 													backgroundColor: 'rgba(0, 0, 0, 0.02)',
// 													cursor: 'pointer'
// 												},
// 												'& .MuiTableCell-root': {
// 													py: 3,
// 													verticalAlign: 'middle',
// 													borderBottom: '1px solid rgba(224, 224, 224, 0.5)'
// 												}
// 											}}
// 										>
// 											<TableCell sx={{ pl: 3, verticalAlign: 'middle' }}>
// 												<Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
// 													<Typography
// 														variant='body2'
// 														color='primary'
// 														sx={{ fontWeight: 600, fontSize: '1.2rem' }}
// 													>
// 														#{category.category_id}
// 													</Typography>
// 												</Box>
// 											</TableCell>
// 											<TableCell sx={{ verticalAlign: 'middle' }}>
// 												<Box
// 													sx={{
// 														display: 'flex',
// 														alignItems: 'center',
// 														gap: 2,
// 														height: '100%'
// 													}}
// 												>
// 													{category.image_url ? (
// 														<Avatar
// 															src={
// 																category.image_url.startsWith('http')
// 																	? category.image_url
// 																	: `${import.meta.env.VITE_IMAGE_URL || API_BASE_URL}${category.image_url.startsWith('/') ? category.image_url : '/' + category.image_url}`
// 															}
// 															alt={category.name}
// 															sx={{
// 																width: 44,
// 																height: 44,
// 																boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
// 															}}
// 														/>
// 													) : (
// 														<Avatar
// 															sx={{
// 																width: 44,
// 																height: 44,
// 																bgcolor: 'primary.main',
// 																boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
// 																fontWeight: 600
// 															}}
// 														>
// 															{getCategoryInitials(category.name)}
// 														</Avatar>
// 													)}
// 													<Box>
// 														<Typography
// 															variant='body2'
// 															fontWeight='600'
// 															component={Link}
// 															to={`/apps/solution-categories/solution-management/${category.category_id}`}
// 															sx={{
// 																textDecoration: 'none',
// 																color: '#1a1a1a',
// 																fontSize: '1.2rem',
// 																'&:hover': {
// 																	color: 'primary.main',
// 																	textDecoration: 'underline'
// 																}
// 															}}
// 														>
// 															{category.name}
// 														</Typography>
// 														{category.content_count !== undefined && (
// 															<Typography
// 																variant='caption'
// 																sx={{
// 																	fontWeight: 500,
// 																	color: '#666666',
// 																	fontSize: '0.75rem'
// 																}}
// 															>
// 																{category.content_count} {t('content items')}
// 															</Typography>
// 														)}
// 													</Box>
// 												</Box>
// 											</TableCell>
// 											<TableCell sx={{ maxWidth: 300, verticalAlign: 'middle' }}>
// 												<Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
// 													<Typography
// 														variant='body2'
// 														sx={{
// 															overflow: 'hidden',
// 															textOverflow: 'ellipsis',
// 															whiteSpace: 'nowrap',
// 															color: '#4a4a4a',
// 															fontSize: '1.2rem'
// 														}}
// 													>
// 														{category.description || t('No description provided')}
// 													</Typography>
// 												</Box>
// 											</TableCell>
// 											<TableCell sx={{ verticalAlign: 'middle' }}>
// 												<Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
// 													<Chip
// 														label={category.active === 1 ? t('Active') : t('Inactive')}
// 														size='small'
// 														color={category.active === 1 ? 'success' : 'default'}
// 														variant={category.active === 1 ? 'filled' : 'outlined'}
// 														sx={{
// 															fontWeight: 600,
// 															borderRadius: 2,
// 															...(category.active === 1 && {
// 																backgroundColor: '#e8f5e8',
// 																color: '#2e7d32'
// 															})
// 														}}
// 													/>
// 												</Box>
// 											</TableCell>
// 											{/* <TableCell sx={{ verticalAlign: 'middle' }}>
// 												<Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
// 													<Typography
// 														variant='body2'
// 														sx={{
// 															fontWeight: 500,
// 															color: '#4a4a4a',
// 															fontSize: '1.2rem'
// 														}}
// 													>
// 														{formatDate(category.created_at)}
// 													</Typography>
// 												</Box>
// 											</TableCell> */}
// 											<TableCell
// 												align='center'
// 												sx={{ pr: 3 }}
// 											>
// 												<Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
// 													<IconButton
// 														size='small'
// 														onClick={() => {
// 															setViewCategory(category);
// 															fetchContentDetails(category.category_id, language.id);
// 														}}
// 														sx={{
// 															backgroundColor: 'rgba(25, 118, 210, 0.04)',
// 															color: 'primary.main',
// 															'&:hover': {
// 																backgroundColor: 'rgba(25, 118, 210, 0.12)'
// 															}
// 														}}
// 													>
// 														<VisibilityIcon fontSize='small' />
// 													</IconButton>
// 													<IconButton
// 														size='small'
// 														onClick={() => setEditCategory(category)}
// 														sx={{
// 															backgroundColor: 'rgba(237, 108, 2, 0.04)',
// 															color: 'warning.main',
// 															'&:hover': {
// 																backgroundColor: 'rgba(237, 108, 2, 0.12)'
// 															}
// 														}}
// 													>
// 														<EditIcon fontSize='small' />
// 													</IconButton>
// 													<IconButton
// 														size='small'
// 														onClick={() => setDeleteCategory(category)}
// 														disabled={loading}
// 														sx={{
// 															backgroundColor: 'rgba(211, 47, 47, 0.04)',
// 															color: 'error.main',
// 															'&:hover': {
// 																backgroundColor: 'rgba(211, 47, 47, 0.12)'
// 															},
// 															'&:disabled': {
// 																backgroundColor: 'rgba(0, 0, 0, 0.04)',
// 																color: 'rgba(0, 0, 0, 0.26)'
// 															}
// 														}}
// 													>
// 														<DeleteIcon fontSize='small' />
// 													</IconButton>
// 												</Box>
// 											</TableCell>
// 										</TableRow>
// 									))
// 							)}
// 						</TableBody>
// 					</Table>
// 				</TableContainer>

// 				<TablePagination
// 					rowsPerPageOptions={[5, 10, 25]}
// 					component='div'
// 					count={filteredCategories.length}
// 					rowsPerPage={rowsPerPage}
// 					page={page}
// 					onPageChange={handleChangePage}
// 					onRowsPerPageChange={handleChangeRowsPerPage}
// 				/>
// 			</Paper>

// 			{/* View Category Dialog */}
// 			<Dialog
// 				open={!!viewCategory}
// 				onClose={() => setViewCategory(null)}
// 				maxWidth='md'
// 				fullWidth
// 			>
// 				<DialogTitle>{t('Category Details')}: {viewCategory?.name}</DialogTitle>
// 				<DialogContent>
// 					{viewCategory && (
// 						<Box sx={{ pt: 2 }}>
// 							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
// 								{viewCategory.image_url ? (
// 									<Avatar
// 										src={
// 											viewCategory.image_url.startsWith('http')
// 												? viewCategory.image_url
// 												: `${import.meta.env.VITE_IMAGE_URL || API_BASE_URL}${viewCategory.image_url.startsWith('/') ? viewCategory.image_url : '/' + viewCategory.image_url}`
// 										}
// 										alt={viewCategory.name}
// 										sx={{ width: 60, height: 60 }}
// 									/>
// 								) : (
// 									<Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
// 										{getCategoryInitials(viewCategory.name)}
// 									</Avatar>
// 								)}
// 								<Box>
// 									<Typography
// 										variant='h6'
// 										fontWeight='bold'
// 									>
// 										{viewCategory.name}
// 									</Typography>
// 									<Chip
// 										label={viewCategory.active ? t('Active' ): t('Inactive')}
// 										size='small'
// 										color={viewCategory.active ? 'success' : 'default'}
// 										variant='outlined'
// 									/>
// 								</Box>
// 							</Box>

// 							<Typography
// 								variant='body1'
// 								color='text.secondary'
// 								gutterBottom
// 							>
// 								{viewCategory.description || t('No description provided')}
// 							</Typography>

// 							<Typography
// 								variant='h6'
// 								sx={{ mt: 3, mb: 2 }}
// 							>
// 								{t('Content')}({contentDetails.length} {t('items')})
// 							</Typography>

// 							{loadingContent ? (
// 								<Box sx={{ textAlign: 'center', py: 2 }}>
// 									<CircularProgress size={24} />
// 								</Box>
// 							) : contentDetails.length > 0 ? (
// 								<Box sx={{ maxHeight: 300, overflow: 'auto' }}>
// 									{contentDetails.map((detail, index) => (
// 										<Paper
// 											key={detail.content_id}
// 											sx={{ p: 2, mb: 1 }}
// 										>
// 											<Typography
// 												variant='subtitle2'
// 												fontWeight='bold'
// 											>
// 												#{index + 1}: {detail.title}
// 											</Typography>
// 											<Typography
// 												variant='body2'
// 												color='text.secondary'
// 												sx={{ mt: 1 }}
// 											>
// 												{detail.content.substring(0, 150)}
// 												{detail.content.length > 150 && '...'}
// 											</Typography>
// 										</Paper>
// 									))}
// 								</Box>
// 							) : (
// 								<Typography
// 									variant='body2'
// 									color='text.disabled'
// 								>
// 									{t('No content available for this category')}
// 								</Typography>
// 							)}
// 						</Box>
// 					)}
// 				</DialogContent>
// 				<DialogActions>
// 					<Button
// 						variant='outlined'
// 						startIcon={<EditIcon />}
// 						onClick={() => {
// 							if (viewCategory) setEditCategory(viewCategory);

// 							setViewCategory(null);
// 						}}
// 					>
// 					{t('Edit Category')}
// 					</Button>
// 					<Button
// 						variant='outlined'
// 						component={Link}
// 						to={`/apps/solution-categories/solution-management/${viewCategory?.category_id}`}
// 					>
// 						{t('Manage Content')}
// 					</Button>
// 					<Button onClick={() => setViewCategory(null)}>{t('Close')}</Button>
// 				</DialogActions>
// 			</Dialog>

// 			{/* Edit Dialog */}
// 			{/* <Dialog
// 				open={!!editCategory}
// 				onClose={() => setEditCategory(null)}
// 				maxWidth='md'
// 				fullWidth
// 			>
// 				<DialogTitle
// 					sx={{
// 						display: 'flex',
// 						alignItems: 'center',
// 						gap: 2,
// 						pb: 1
// 					}}
// 				>
// 					<EditIcon color='primary' />
// 					Edit Category
// 				</DialogTitle>
// 				<DialogContent>
// 					{editCategory && (
// 						<Box sx={{ pt: 2 }}>
// 							<MultiLanguageField
// 								label='Category Name'
// 								valueEn={editCategory.name}
// 								valueTh={editCategory.name_en || ''}
// 								onChangeEn={(value) => setEditCategory({ ...editCategory, name: value })}
// 								onChangeTh={(value) => setEditCategory({ ...editCategory, name_en: value })}
// 								required={true}
// 							/>

// 							<MultiLanguageField
// 								label='Description'
// 								valueEn={editCategory.description}
// 								valueTh={editCategory.description_en || ''}
// 								onChangeEn={(value) => setEditCategory({ ...editCategory, description: value })}
// 								onChangeTh={(value) => setEditCategory({ ...editCategory, description_en: value })}
// 								multiline={true}
// 								rows={4}
// 							/>

// 							<ImageUploadSection
// 								imageUrl={editCategory.image_url}
// 								onImageChange={(url) => setEditCategory({ ...editCategory, image_url: url })}
// 							/>

// 							<FormControlLabel
// 								control={
// 									<Switch
// 										checked={editCategory.active}
// 										onChange={(e) =>
// 											setEditCategory({
// 												...editCategory,
// 												active: e.target.checked
// 											})
// 										}
// 									/>
// 								}
// 								label='Active Status'
// 								sx={{ mt: 1 }}
// 							/>
// 						</Box>
// 					)}
// 				</DialogContent>
// 				<DialogActions sx={{ px: 3, pb: 3 }}>
// 					<Button
// 						onClick={() => setEditCategory(null)}
// 						sx={{
// 							textTransform: 'none',
// 							borderRadius: 2
// 						}}
// 					>
// 						Cancel
// 					</Button>
// 					<Button
// 						onClick={handleSaveEdit}
// 						variant='contained'
// 						disabled={loading || uploadingImage || !editCategory?.name.trim()}
// 						sx={{
// 							textTransform: 'none',
// 							borderRadius: 2,
// 							px: 3
// 						}}
// 					>
// 						{loading ? 'Saving...' : 'Save Changes'}
// 					</Button>
// 				</DialogActions>
// 			</Dialog> */}

// 			<Dialog
// 				open={!!editCategory}
// 				onClose={() => setEditCategory(null)}
// 				maxWidth='md'
// 				fullWidth
// 			>
// 				<DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
// 					<EditIcon color='primary' />
// 					{t('Edit Category')}
// 				</DialogTitle>
// 				<DialogContent>
// 					{editCategory && (
// 						<Box sx={{ pt: 2 }}>
// 							<TextField
// 								label={t('Category Name')}
// 								value={editCategory.name}
// 								onChange={(e) =>
// 									setEditCategory({ ...editCategory, name: e.target.value, lang: currentLang })
// 								}
// 								required
// 								fullWidth
// 								margin='normal'
// 							/>

// 							<TextField
// 								label={t('Description')}
// 								value={editCategory.description}
// 								onChange={(e) =>
// 									setEditCategory({ ...editCategory, description: e.target.value, lang: currentLang })
// 								}
// 								required
// 								fullWidth
// 								margin='normal'
// 								multiline
// 								rows={4}
// 							/>

// 							<ImageUploadSection
// 								imageUrl={editCategory.image_url}
// 								onImageChange={(url) => setEditCategory({ ...editCategory, image_url: url })}
// 							/>

// 							<FormControlLabel
// 								control={
// 									<Switch
// 										checked={!!editCategory.active}
// 										onChange={(e) =>
// 											setEditCategory({ ...editCategory, active: e.target.checked ? 1 : 0 })
// 										}
// 									/>
// 								}
// 								label={t('Active Status')}
// 								sx={{ mt: 1 }}
// 							/>
// 						</Box>
// 					)}
// 				</DialogContent>
// 				<DialogActions sx={{ px: 3, pb: 3 }}>
// 					<Button onClick={() => setEditCategory(null)}>{t('Cancel')}</Button>
// 					<Button
// 						onClick={handleSaveEdit}
// 						variant='contained'
// 						disabled={loading || !editCategory?.name.trim()}
// 					>
// 						{loading ? t('Saving...') : t('Save Changes')}
// 					</Button>
// 				</DialogActions>
// 			</Dialog>

// 			{/* New Category Dialog */}
// 			<Dialog
// 				open={!!newCategory}
// 				onClose={() => setNewCategory(null)}
// 				maxWidth='md'
// 				fullWidth
// 			>
// 				<DialogTitle
// 					sx={{
// 						display: 'flex',
// 						alignItems: 'center',
// 						gap: 2,
// 						pb: 1
// 					}}
// 				>
// 					<AddIcon color='primary' />
// 					{t('Create New Category')}
// 				</DialogTitle>
// 				<DialogContent>
// 					{newCategory && (
// 						<Box sx={{ pt: 2 }}>
// 							<MultiLanguageField
// 								label={t('Category Name')}
// 								valueEn={newCategory.name}
// 								valueTh={newCategory.name_en || ''}
// 								onChangeEn={(value) => setNewCategory({ ...newCategory, name: value })}
// 								onChangeTh={(value) => setNewCategory({ ...newCategory, name_en: value })}
// 								required={true}
// 							/>

// 							<MultiLanguageField
// 								label={t('Description')}
// 								valueEn={newCategory.description}
// 								valueTh={newCategory.description_en || ''}
// 								onChangeEn={(value) => setNewCategory({ ...newCategory, description: value })}
// 								onChangeTh={(value) => setNewCategory({ ...newCategory, description_en: value })}
// 								multiline={true}
// 								rows={4}
// 							/>

// 							<ImageUploadSection
// 								imageUrl={newCategory.image_url}
// 								onImageChange={(url) => setNewCategory({ ...newCategory, image_url: url })}
// 								label={t('Category Image (Optional)')}
// 							/>

// 							<FormControlLabel
// 								control={
// 									<Switch
// 										checked={newCategory.active}
// 										onChange={(e) =>
// 											setNewCategory({
// 												...newCategory,
// 												active: e.target.checked
// 											})
// 										}
// 									/>
// 								}
// 								label={t('Set as Active')}
// 								sx={{ mt: 1 }}
// 							/>
// 						</Box>
// 					)}
// 				</DialogContent>
// 				<DialogActions sx={{ px: 3, pb: 3 }}>
// 					<Button
// 						onClick={() => setNewCategory(null)}
// 						sx={{
// 							textTransform: 'none',
// 							borderRadius: 2
// 						}}
// 					>
// 						{t('Cancel')}
// 					</Button>
// 					<Button
// 						onClick={handleSaveNew}
// 						variant='contained'
// 						disabled={loading || uploadingImage || !newCategory?.name.trim()}
// 						sx={{
// 							textTransform: 'none',
// 							borderRadius: 2,
// 							px: 3,
// 							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// 							'&:hover': {
// 								background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
// 							}
// 						}}
// 					>
// 						{loading ? t('Creating...') : t('Create Category')}
// 					</Button>
// 				</DialogActions>
// 			</Dialog>

// 			{/* Delete Confirmation Dialog */}
// 			<Dialog
// 				open={!!deleteCategory}
// 				onClose={() => setDeleteCategory(null)}
// 				maxWidth='sm'
// 				fullWidth
// 			>
// 				<DialogTitle
// 					sx={{
// 						display: 'flex',
// 						alignItems: 'center',
// 						gap: 2,
// 						pb: 1,
// 						color: 'error.main'
// 					}}
// 				>
// 					<WarningIcon color='error' />
// 					{t('Confirm Delete')}
// 				</DialogTitle>
// 				<DialogContent>
// 					{deleteCategory && (
// 						<Box sx={{ pt: 2 }}>
// 							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
// 								{deleteCategory.image_url ? (
// 									<Avatar
// 										src={
// 											deleteCategory.image_url.startsWith('http')
// 												? deleteCategory.image_url
// 												: `${import.meta.env.VITE_IMAGE_URL || API_BASE_URL}${deleteCategory.image_url.startsWith('/') ? deleteCategory.image_url : '/' + deleteCategory.image_url}`
// 										}
// 										alt={deleteCategory.name}
// 										sx={{ width: 60, height: 60 }}
// 									/>
// 								) : (
// 									<Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
// 										{getCategoryInitials(deleteCategory.name)}
// 									</Avatar>
// 								)}
// 								<Box>
// 									<Typography
// 										variant='h6'
// 										fontWeight='bold'
// 									>
// 										{deleteCategory.name}
// 									</Typography>
// 									<Typography
// 										variant='body2'
// 										color='text.secondary'
// 									>
// 										{t('ID')}: #{deleteCategory.category_id}
// 									</Typography>
// 								</Box>
// 							</Box>

// 							<Alert
// 								severity='warning'
// 								sx={{ mb: 2 }}
// 							>
// 								<Typography
// 									variant='body1'
// 									fontWeight='500'
// 								>
// 									{t('Are you sure you want to delete this category?')}
// 								</Typography>
// 								<Typography
// 									variant='body2'
// 									sx={{ mt: 1 }}
// 								>
// 									{t('This action cannot be undone. All associated content and data will be permanently removed.')}
// 								</Typography>
// 							</Alert>

// 							<Typography
// 								variant='body2'
// 								color='text.secondary'
// 							>
// 								<strong>{t('Category')}:</strong> {deleteCategory.name}
// 							</Typography>
// 							<Typography
// 								variant='body2'
// 								color='text.secondary'
// 							>
// 								<strong>{t('Description')}:</strong> {deleteCategory.description || 'No description provided'}
// 							</Typography>
// 							<Typography
// 								variant='body2'
// 								color='text.secondary'
// 							>
// 								<strong>{t('Status')}:</strong> {deleteCategory.active ? 'Active' : 'Inactive'}
// 							</Typography>
// 						</Box>
// 					)}
// 				</DialogContent>
// 				<DialogActions sx={{ px: 3, pb: 3 }}>
// 					<Button
// 						onClick={() => setDeleteCategory(null)}
// 						variant='outlined'
// 						sx={{
// 							textTransform: 'none',
// 							borderRadius: 2,
// 							px: 3
// 						}}
// 					>
// 						{t('Cancel')}
// 					</Button>
// 					<Button
// 						onClick={handleDelete}
// 						variant='contained'
// 						color='error'
// 						disabled={loading}
// 						sx={{
// 							textTransform: 'none',
// 							borderRadius: 2,
// 							px: 3,
// 							background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
// 							'&:hover': {
// 								background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)'
// 							}
// 						}}
// 					>
// 						{loading ? t('Deleting...') : t('Delete Category')}
// 					</Button>
// 				</DialogActions>
// 			</Dialog>

// 			{/* Snackbar */}
// 			<Snackbar
// 				open={snackbar.open}
// 				autoHideDuration={4000}
// 				onClose={handleCloseSnackbar}
// 				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// 			>
// 				<Alert
// 					onClose={handleCloseSnackbar}
// 					severity={snackbar.severity}
// 				>
// 					{snackbar.message}
// 				</Alert>
// 			</Snackbar>
// 		</Box>
// 	);
// };

// export default SolutionCategoriesTable;


import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Avatar, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Box, TablePagination, Chip, IconButton, Switch,
  FormControlLabel, Alert, Snackbar, CircularProgress, InputAdornment, MenuItem,
  Select, FormControl, InputLabel, useTheme, alpha
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Add as AddIcon,
  Search as SearchIcon, Visibility as VisibilityIcon, TrendingUp as TrendingUpIcon,
  Category as CategoryIcon, CheckCircle as CheckCircleIcon, Block as BlockIcon,
  SortByAlpha as SortIcon, FolderOpen as FolderOpenIcon, SearchOff as SearchOffIcon,
  CloudUpload as CloudUploadIcon, Image as ImageIcon, ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon, Warning as WarningIcon
} from '@mui/icons-material';
import Link from '@fuse/core/Link';
import MultiLanguageField from './MultiLanguageField';
import useI18n from '@i18n/useI18n';
import { useTranslation } from 'react-i18next';

interface SolutionCategory {
  category_id: number;
  translation_id: number;
  lang: string;
  name: string;
  description: string;
  image_url: string;
  active: number; // 1|0
  created_at?: string;
  updated_at?: string;
  content_count?: number;
}

interface ContentDetail {
  content_id: number;
  solution_id: number;
  lang: string;
  title: string;
  content: string;
  content_order: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

type SortField = 'name' | 'category_id' | 'created_at';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';

const SolutionCategoriesTable: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { language } = useI18n();
  const currentLang = language.id; // 'en' or 'th'
  const { t } = useTranslation('SolutionPage');

  const [rawCategories, setRawCategories] = useState<SolutionCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<SolutionCategory[]>([]);
  const [editCategory, setEditCategory] = useState<SolutionCategory | null>(null);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    name_en: string;
    description: string;
    description_en: string;
    image_url: string;
    active: boolean;
  } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewCategory, setViewCategory] = useState<SolutionCategory | null>(null);
  const [contentDetails, setContentDetails] = useState<ContentDetail[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<SolutionCategory | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || API_BASE_URL;

  // map translations -> one row per category_id preferring currentLang
  const categories = useMemo(() => {
    const categoryMap = new Map<number, SolutionCategory>();
    for (const cat of rawCategories) {
      const exist = categoryMap.get(cat.category_id);
      if (!exist) categoryMap.set(cat.category_id, cat);
      else if (cat.lang === currentLang) categoryMap.set(cat.category_id, cat);
    }
    return Array.from(categoryMap.values()).sort((a, b) => a.category_id - b.category_id);
  }, [rawCategories, currentLang]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/solution-categories/`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setRawCategories(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchContentDetails = async (solutionId: number, lang: string) => {
    setLoadingContent(true);
    try {
      const res = await fetch(`${API_BASE_URL}/solution-content/`);
      const data = await res.json();
      const filtered = (data as ContentDetail[]).filter(
        (it) => it.solution_id === solutionId && it.lang === lang
      );
      setContentDetails(filtered);
    } catch (e) {
      console.error(e);
      setContentDetails([]);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/uploads/`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();

      let imageUrl: string | null = null;
      if (data.url) imageUrl = data.url;
      else if (data.file_url) imageUrl = data.file_url;
      else if (data.image_url) imageUrl = data.image_url;
      else if (data.path) imageUrl = `${IMAGE_BASE}${data.path}`;
      else if (data.filename) imageUrl = `${IMAGE_BASE}/uploads/${data.filename}`;
      else if (typeof data === 'string') imageUrl = data;
      else {
        const s = JSON.stringify(data);
        const m = s.match(/https?:\/\/[^\s"]+/);
        if (m) imageUrl = m[0];
      }

      if (!imageUrl) throw new Error('Invalid response format from upload API');

      setSnackbar({ open: true, message: t('Image uploaded successfully'), severity: 'success' });
      return imageUrl;
    } catch (e) {
      console.error(e);
      setError('Failed to upload image');
      setSnackbar({ open: true, message: t('Failed to upload image'), severity: 'error' });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // filter + sort
  useEffect(() => {
    let result = [...categories];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        String(c.category_id).includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => (statusFilter === 'active' ? c.active === 1 : c.active === 0));
    }

    result.sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;
      let av: any = a[sortField];
      let bv: any = b[sortField];
      if (sortField === 'created_at') {
        av = new Date(av || 0).getTime();
        bv = new Date(bv || 0).getTime();
      } else if (typeof av === 'string') {
        av = av.toLowerCase();
        bv = (bv as string).toLowerCase();
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });

    setFilteredCategories(result);
    setPage(0);
  }, [categories, searchTerm, statusFilter, sortField, sortDirection]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveEdit = async () => {
    if (!editCategory?.name?.trim()) {
      setError(t('Category name is required'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: any = {};
      if (editCategory.name) payload.name = editCategory.name;
      if (editCategory.description) payload.description = editCategory.description;
      if (editCategory.image_url) payload.image_url = editCategory.image_url;
      if (editCategory.active !== undefined) payload.active = editCategory.active;

      const res = await fetch(
        `${API_BASE_URL}/solution-categories/${editCategory.category_id}/${editCategory.translation_id}`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (!res.ok) throw new Error('Failed to update category');
      fetchCategories();
      setSnackbar({ open: true, message: t('Category updated successfully'), severity: 'success' });
      setEditCategory(null);
    } catch (e) {
      console.error(e);
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNew = async () => {
    if (!newCategory?.name.trim()) {
      setError(t('Category name is required'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/solution-categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      if (!res.ok) throw new Error('Failed to create category');
      fetchCategories();
      setSnackbar({ open: true, message: t('Category created successfully'), severity: 'success' });
      setNewCategory(null);
    } catch (e) {
      console.error(e);
      setError('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/solution-categories/${deleteCategory.category_id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      fetchCategories();
      setSnackbar({
        open: true,
        message: `"${deleteCategory.name}" ${t('deleted successfully')}`,
        severity: 'success'
      });
      setDeleteCategory(null);
    } catch (e) {
      console.error(e);
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const getCategoryInitials = (name: string) =>
    (name || '')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

  const getSortIcon = (field: SortField) =>
    sortField !== field ? (
      <SortIcon sx={{ fontSize: 16, opacity: 0.3 }} />
    ) : sortDirection === 'asc' ? (
      <ArrowUpwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
    ) : (
      <ArrowDownwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
    );

  const formatDate = (s?: string) => (s ? new Date(s).toLocaleDateString() : '-');

  const resolveImage = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${IMAGE_BASE}${url}`;
    return `${IMAGE_BASE}/${url}`;
  };

  const ImageUploadSection = ({
    imageUrl,
    onImageChange,
    label = t('Category Image')
  }: {
    imageUrl: string;
    onImageChange: (url: string) => void;
    label?: string;
  }) => {
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setSnackbar({ open: true, message: t('Please select a valid image file (PNG, JPG, JPEG, GIF, WebP)'), severity: 'error' });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({ open: true, message: t('File size must be less than 10MB'), severity: 'error' });
        return;
      }
      const uploaded = await handleImageUpload(file);
      if (uploaded) onImageChange(uploaded);
      e.target.value = '';
    };

    const full = resolveImage(imageUrl);

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {label}
        </Typography>

        {imageUrl && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={full}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onError={(e) => {
                console.error('Image failed to load:', full);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            >
              <ImageIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('Current image')}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem', color: 'text.disabled' }}>
                {full}
              </Typography>
              <Button size="small" onClick={() => onImageChange('')} sx={{ mt: 0.5, textTransform: 'none' }}>
                {t('Remove image')}
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            disabled={uploadingImage}
            sx={{ textTransform: 'none', borderRadius: 2, flex: 1 }}
          >
            {uploadingImage ? t('Uploading...') : t('Upload Image')}
            <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
          </Button>
          {uploadingImage && <CircularProgress size={24} />}
        </Box>

        <TextField
          label={t('Or enter image URL manually')}
          fullWidth
          value={imageUrl}
          onChange={(e) => onImageChange(e.target.value)}
          size="small"
          sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          placeholder="https://example.com/image.jpg"
          helperText={t('Upload a file above or paste an image URL here')}
        />
      </Box>
    );
  };

  const stats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((c) => c.active === 1).length,
      inactive: categories.filter((c) => c.active === 0).length
    }),
    [categories]
  );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        background: isDark
          ? `linear-gradient(135deg, ${alpha('#0b1020', 0.9)} 0%, ${alpha('#141a2a', 0.9)} 100%)`
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1
          }}
        >
          {t('Solution Categories')}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          {t('Manage and organize your solution categories with ease • Language')}: {currentLang.toUpperCase()}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
        <Paper
          elevation={isDark ? 0 : 2}
          sx={{
            p: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', position: 'relative', overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', background: 'rgba(255,255,255,0.12)', borderRadius: '0 0 0 100px' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
            <CategoryIcon sx={{ fontSize: 32, opacity: 0.9 }} />
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500 }}>{t('Total Categories')}</Typography>
        </Paper>

        <Paper
          elevation={isDark ? 0 : 2}
          sx={{
            p: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white', position: 'relative', overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', background: 'rgba(255,255,255,0.12)', borderRadius: '0 0 0 100px' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.active}</Typography>
            <CheckCircleIcon sx={{ fontSize: 32, opacity: 0.9 }} />
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500 }}>{t('Active Categories')}</Typography>
        </Paper>

        <Paper
          elevation={isDark ? 0 : 2}
          sx={{
            p: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
            color: 'white', position: 'relative', overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', background: 'rgba(255,255,255,0.12)', borderRadius: '0 0 0 100px' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.inactive}</Typography>
            <BlockIcon sx={{ fontSize: 32, opacity: 0.9 }} />
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500 }}>{t('Inactive Categories')}</Typography>
        </Paper>

        <Paper
          elevation={isDark ? 0 : 2}
          sx={{
            p: 3, borderRadius: 3,
            background: isDark
              ? `linear-gradient(135deg, ${alpha('#ffffff', 0.06)} 0%, ${alpha('#ffffff', 0.02)} 100%)`
              : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            color: isDark ? theme.palette.text.primary : '#333',
            position: 'relative', overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.3)', borderRadius: '0 0 0 100px' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{filteredCategories.length}</Typography>
            <TrendingUpIcon sx={{ fontSize: 32, opacity: 0.8 }} />
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {searchTerm || statusFilter !== 'all' ? t('Search Results') : t('Total Showing')}
          </Typography>
        </Paper>
      </Box>

      {/* Controls */}
      <Paper
        elevation={isDark ? 0 : 1}
        sx={{
          p: 3, mb: 3, borderRadius: 3,
          border: `1px solid ${isDark ? alpha('#fff', 0.08) : 'rgba(0,0,0,0.05)'}`,
          backgroundColor: isDark ? alpha('#000', 0.2) : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder={t('Search categories...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              minWidth: 320, flex: 1, maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isDark ? alpha('#fff', 0.04) : 'white',
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: isDark ? alpha('#fff', 0.04) : 'white' } }}>
            <InputLabel>{t('Status')}</InputLabel>
            <Select value={statusFilter} label={t('Status')} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
              <MenuItem value="all">{t('All Status')}</MenuItem>
              <MenuItem value="active">{t('Active')}</MenuItem>
              <MenuItem value="inactive">{t('Inactive')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: isDark ? alpha('#fff', 0.04) : 'white' } }}>
            <InputLabel>{t('Sort By')}</InputLabel>
            <Select value={sortField} label={t('Sort By')} onChange={(e) => setSortField(e.target.value as SortField)}>
              <MenuItem value="name">{t('Name')}</MenuItem>
              <MenuItem value="category_id">{t('ID')}</MenuItem>
              {/* <MenuItem value='created_at'>{t('Created Date')}</MenuItem> */}
            </Select>
          </FormControl>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchCategories}
              disabled={loading}
              sx={{
                borderRadius: 2, px: 2.5, py: 1, textTransform: 'none', fontWeight: 600,
                borderColor: isDark ? alpha('#fff', 0.2) : 'rgba(0,0,0,0.12)',
                color: 'text.primary',
                '&:hover': { borderColor: 'primary.main', backgroundColor: alpha(theme.palette.primary.main, 0.06) }
              }}
            >
              {t('Refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewCategory({ name: '', name_en: '', description: '', description_en: '', image_url: '', active: true })}
              sx={{
                borderRadius: 2, px: 3, py: 1, textTransform: 'none', fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(102,126,234,0.3)',
                '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)', transform: 'translateY(-1px)' }
              }}
            >
              {t('Add Category')}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <Paper
        elevation={isDark ? 0 : 2}
        sx={{
          width: '100%', overflow: 'hidden', borderRadius: 3,
          border: `1px solid ${isDark ? alpha('#fff', 0.08) : 'rgba(0,0,0,0.05)'}`
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{ m: 2 }}
            action={
              <Button color="inherit" size="small" onClick={fetchCategories}>
                {t('Retry')}
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderBottom: `1px solid ${isDark ? alpha('#fff', 0.06) : 'rgba(224,224,224,0.5)'}` } }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: isDark ? alpha('#fff', 0.03) : 'rgba(0,0,0,0.02)',
                  '& .MuiTableCell-head': {
                    fontWeight: 600, color: 'text.primary', textTransform: 'uppercase', fontSize: '1.05rem', letterSpacing: '0.5px', py: 2.2
                  }
                }}
              >
                <TableCell sx={{ pl: 3 }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', userSelect: 'none', '&:hover': { color: 'primary.main' } }}
                    onClick={() => setSortField((prev) => (prev === 'category_id' ? prev : 'category_id'))}
                  >
                    {t('ID')}
                    {getSortIcon('category_id')}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', userSelect: 'none', '&:hover': { color: 'primary.main' } }}
                    onClick={() => setSortField((prev) => (prev === 'name' ? prev : 'name'))}
                  >
                    {t('Category')}
                    {getSortIcon('name')}
                  </Box>
                </TableCell>
                <TableCell>{t('Description')}</TableCell>
                <TableCell>{t('Status')}</TableCell>
                <TableCell align="center" sx={{ pr: 3 }}>{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ height: 200, py: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
                      <CircularProgress size={48} thickness={4} />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{t('Loading Categories...')}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('Please wait while we fetch your solution categories...')}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      {searchTerm || statusFilter !== 'all' ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 3, borderRadius: '50%', backgroundColor: alpha(theme.palette.warning.main, 0.12), color: 'warning.main' }}>
                            <SearchOffIcon sx={{ fontSize: 48 }} />
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {t('No Matching Categories Found')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {t('Try adjusting your search terms or filters to find what you looking for')}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                              sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                              {t('Clear Filters')}
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 3, borderRadius: '50%', backgroundColor: alpha(theme.palette.primary.main, 0.12), color: 'primary.main' }}>
                            <FolderOpenIcon sx={{ fontSize: 48 }} />
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {t('No Categories Yet')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {t('Get started by creating your first solution category to organize your content')}
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => setNewCategory({ name: '', name_en: '', description: '', description_en: '', image_url: '', active: true })}
                              sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
                            >
                              {t('Create First Category')}
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <TableRow
                      key={`${category.category_id}-${category.translation_id}`}
                      hover
                      sx={{
                        '&:hover': { backgroundColor: isDark ? alpha('#fff', 0.03) : 'rgba(0,0,0,0.02)', cursor: 'pointer' },
                        '& .MuiTableCell-root': { py: 3, verticalAlign: 'middle', borderBottom: `1px solid ${isDark ? alpha('#fff', 0.06) : 'rgba(224,224,224,0.5)'}` }
                      }}
                    >
                      <TableCell sx={{ pl: 3 }}>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                          #{category.category_id}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {category.image_url ? (
                            <Avatar
                              src={resolveImage(category.image_url)}
                              alt={category.name}
                              sx={{ width: 44, height: 44, boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.1)' }}
                            />
                          ) : (
                            <Avatar sx={{ width: 44, height: 44, bgcolor: 'primary.main', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.1)', fontWeight: 600 }}>
                              {getCategoryInitials(category.name)}
                            </Avatar>
                          )}
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              component={Link}
                              to={`/apps/solution-categories/solution-management/${category.category_id}`}
                              sx={{ textDecoration: 'none', color: 'text.primary', fontSize: '1.1rem', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
                            >
                              {category.name}
                            </Typography>
                            {category.content_count !== undefined && (
                              <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', display: 'block' }}>
                                {category.content_count} {t('content items')}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography
                          variant="body2"
                          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '1.05rem' }}
                          title={category.description || t('No description provided')}
                        >
                          {category.description || t('No description provided')}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={category.active === 1 ? t('Active') : t('Inactive')}
                          size="small"
                          color={category.active === 1 ? 'success' : 'default'}
                          variant={category.active === 1 ? 'filled' : 'outlined'}
                          sx={{
                            fontWeight: 600, borderRadius: 2,
                            ...(category.active === 1 && {
                              backgroundColor: isDark ? alpha('#2e7d32', 0.25) : '#e8f5e8',
                              color: '#2e7d32'
                            })
                          }}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ pr: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => { setViewCategory(category); fetchContentDetails(category.category_id, language.id); }}
                            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.06), color: 'primary.main', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.12) } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setEditCategory(category)}
                            sx={{ backgroundColor: alpha(theme.palette.warning.main, 0.06), color: 'warning.main', '&:hover': { backgroundColor: alpha(theme.palette.warning.main, 0.12) } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setDeleteCategory(category)}
                            disabled={loading}
                            sx={{
                              backgroundColor: alpha(theme.palette.error.main, 0.06),
                              color: 'error.main',
                              '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.12) },
                              '&:disabled': { backgroundColor: isDark ? alpha('#fff', 0.04) : 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.26)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View Category Dialog */}
      <Dialog open={!!viewCategory} onClose={() => setViewCategory(null)} maxWidth="md" fullWidth>
        <DialogTitle>{t('Category Details')}: {viewCategory?.name}</DialogTitle>
        <DialogContent>
          {viewCategory && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                {viewCategory.image_url ? (
                  <Avatar src={resolveImage(viewCategory.image_url)} alt={viewCategory.name} sx={{ width: 60, height: 60 }} />
                ) : (
                  <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                    {getCategoryInitials(viewCategory.name)}
                  </Avatar>
                )}
                <Box>
                  <Typography variant="h6" fontWeight="bold">{viewCategory.name}</Typography>
                  <Chip
                    label={viewCategory.active ? t('Active') : t('Inactive')}
                    size="small"
                    color={viewCategory.active ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Typography variant="body1" color="text.secondary" gutterBottom>
                {viewCategory.description || t('No description provided')}
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                {t('Content')} ({contentDetails.length} {t('items')})
              </Typography>

              {loadingContent ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : contentDetails.length > 0 ? (
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {contentDetails.map((detail, idx) => (
                    <Paper key={detail.content_id} sx={{ p: 2, mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        #{idx + 1}: {detail.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {detail.content.substring(0, 150)}
                        {detail.content.length > 150 && '...'}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.disabled">
                  {t('No content available for this category')}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => { if (viewCategory) setEditCategory(viewCategory); setViewCategory(null); }}>
            {t('Edit Category')}
          </Button>
          <Button variant="outlined" component={Link} to={`/apps/solution-categories/solution-management/${viewCategory?.category_id}`}>
            {t('Manage Content')}
          </Button>
          <Button onClick={() => setViewCategory(null)}>{t('Close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCategory} onClose={() => setEditCategory(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
          <EditIcon color="primary" />
          {t('Edit Category')}
        </DialogTitle>
        <DialogContent>
          {editCategory && (
            <Box sx={{ pt: 2 }}>
              <TextField
                label={t('Category Name')}
                value={editCategory.name}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value, lang: currentLang })}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label={t('Description')}
                value={editCategory.description}
                onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value, lang: currentLang })}
                required
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <ImageUploadSection
                imageUrl={editCategory.image_url}
                onImageChange={(url) => setEditCategory({ ...editCategory, image_url: url })}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!editCategory.active}
                    onChange={(e) => setEditCategory({ ...editCategory, active: e.target.checked ? 1 : 0 })}
                  />
                }
                label={t('Active Status')}
                sx={{ mt: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditCategory(null)}>{t('Cancel')}</Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={loading || !editCategory?.name?.trim()}>
            {loading ? t('Saving...') : t('Save Changes')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Category Dialog */}
      <Dialog open={!!newCategory} onClose={() => setNewCategory(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
          <AddIcon color="primary" />
          {t('Create New Category')}
        </DialogTitle>
        <DialogContent>
          {newCategory && (
            <Box sx={{ pt: 2 }}>
              <MultiLanguageField
                label={t('Category Name')}
                valueEn={newCategory.name}
                valueTh={newCategory.name_en || ''}
                onChangeEn={(v) => setNewCategory({ ...newCategory, name: v })}
                onChangeTh={(v) => setNewCategory({ ...newCategory, name_en: v })}
                required
              />
              <MultiLanguageField
                label={t('Description')}
                valueEn={newCategory.description}
                valueTh={newCategory.description_en || ''}
                onChangeEn={(v) => setNewCategory({ ...newCategory, description: v })}
                onChangeTh={(v) => setNewCategory({ ...newCategory, description_en: v })}
                multiline
                rows={4}
              />
              <ImageUploadSection
                imageUrl={newCategory.image_url}
                onImageChange={(url) => setNewCategory({ ...newCategory, image_url: url })}
                label={t('Category Image (Optional)')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newCategory.active}
                    onChange={(e) => setNewCategory({ ...newCategory, active: e.target.checked })}
                  />
                }
                label={t('Set as Active')}
                sx={{ mt: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setNewCategory(null)} sx={{ textTransform: 'none', borderRadius: 2 }}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleSaveNew}
            variant="contained"
            disabled={loading || uploadingImage || !newCategory?.name?.trim()}
            sx={{
              textTransform: 'none', borderRadius: 2, px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
            }}
          >
            {loading ? t('Creating...') : t('Create Category')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCategory} onClose={() => setDeleteCategory(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1, color: 'error.main' }}>
          <WarningIcon color="error" />
          {t('Confirm Delete')}
        </DialogTitle>
        <DialogContent>
          {deleteCategory && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                {deleteCategory.image_url ? (
                  <Avatar src={resolveImage(deleteCategory.image_url)} alt={deleteCategory.name} sx={{ width: 60, height: 60 }} />
                ) : (
                  <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                    {getCategoryInitials(deleteCategory.name)}
                  </Avatar>
                )}
                <Box>
                  <Typography variant="h6" fontWeight="bold">{deleteCategory.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('ID')}: #{deleteCategory.category_id}
                  </Typography>
                </Box>
              </Box>

              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="500">
                  {t('Are you sure you want to delete this category?')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t('This action cannot be undone. All associated content and data will be permanently removed.')}
                </Typography>
              </Alert>

              <Typography variant="body2" color="text.secondary">
                <strong>{t('Category')}:</strong> {deleteCategory.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>{t('Description')}:</strong> {deleteCategory.description || t('No description provided')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>{t('Status')}:</strong> {deleteCategory.active ? t('Active') : t('Inactive')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteCategory(null)} variant="outlined" sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
            sx={{
              textTransform: 'none', borderRadius: 2, px: 3,
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)' }
            }}
          >
            {loading ? t('Deleting...') : t('Delete Category')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SolutionCategoriesTable;
