// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import {
// 	Dialog,
// 	DialogActions,
// 	DialogTitle,
// 	DialogContent,
// 	Button,
// 	IconButton,
// 	Box,
// 	Typography,
// 	TextField,
// 	InputAdornment,
// 	MenuItem,
// 	Select,
// 	FormControl,
// 	Avatar,
// 	Card,
// 	Grid,
// 	Chip,
// 	Zoom,
// 	CircularProgress,
// 	Tabs,
// 	Tab
// } from '@mui/material';
// import {
// 	Close as CloseIcon,
// 	Edit as EditIcon,
// 	CloudUpload as CloudUploadIcon,
// 	Image as ImageIcon,
// 	Language as LanguageIcon
// } from '@mui/icons-material';
// import { useTranslation } from 'react-i18next';

// interface BlogTranslation {
// 	id?: number;
// 	blog_post_id: number;
// 	lang: 'th' | 'en';
// 	title: string;
// 	slug: string;
// 	content: string;
// 	excerpt: string | null;
// }

// interface BlogMedia {
// 	media_id: number;
// 	post_id: number;
// 	media_type: string;
// 	media_url: string;
// 	caption: string | null;
// 	display_order: number;
// }

// interface BlogCategory {
// 	category_id: number;
// 	name: string;
// 	slug: string;
// 	description: string | null;
// }

// interface Author {
// 	user_id: number;
// 	username: string;
// 	first_name: string | null;
// 	last_name: string | null;
// }

// interface BlogPost {
// 	post_id: number;
// 	category_id: number | null;
// 	author_id: number;
// 	featured_image: string | null;
// 	status: string;
// 	published_at: string | null;
// 	created_at: string;
// 	updated_at: string;
// 	translations?: BlogTranslation[];
// 	category?: BlogCategory;
// 	author?: Author;
// 	media?: BlogMedia[];
// }

// interface ImageUploadFieldProps {
// 	label: string;
// 	imageUrl: string;
// 	onImageChange: (url: string) => void;
// 	uploadingImage: boolean;
// 	setUploadingImage: (uploading: boolean) => void;
// }

// const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
// 	label,
// 	imageUrl,
// 	onImageChange,
// 	uploadingImage,
// 	setUploadingImage
// }) => {
// 	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://myfarmsuk.com/api';
// 	const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`) : '';
// 	const { t , i18n } = useTranslation('Blog');
	
// 	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = e.target.files?.[0];

// 		if (!file) return;

// 		if (!file.type.startsWith('image/')) {
// 			alert('Please select an image file');
// 			return;
// 		}

// 		if (file.size > 5 * 1024 * 1024) {
// 			alert('File size must be less than 5MB');
// 			return;
// 		}

// 		try {
// 			setUploadingImage(true);

// 			const formData = new FormData();
// 			formData.append('file', file);

// 			const response = await fetch(`${API_BASE_URL}/uploads`, {
// 				method: 'POST',
// 				body: formData
// 			});

// 			if (!response.ok) {
// 				throw new Error(`Upload failed: ${response.status}`);
// 			}

// 			const result = await response.json();

// 			if (result.path) {
// 				onImageChange(result.path);
// 			} else {
// 				throw new Error('No URL returned from upload');
// 			}
// 		} catch (error: any) {
// 			console.error('Image upload error:', error);
// 			alert(`Failed to upload image: ${error.message}`);
// 		} finally {
// 			setUploadingImage(false);
// 		}
// 	};

// 	return (
// 		<Box sx={{ mb: 2 }}>
// 			<Typography
// 				variant='h6'
// 				sx={{ mb: 1, fontWeight: 600 }}
// 			>
// 				{label}
// 			</Typography>

// 			{imageUrl && (
// 				<Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
// 					<Avatar
// 						src={fullImageUrl}
// 						sx={{
// 							width: 80,
// 							height: 80,
// 							borderRadius: 2,
// 							boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
// 						}}
// 					>
// 						<ImageIcon />
// 					</Avatar>
// 					<Box>
// 						<Typography
// 							variant='h6'
// 							color='text.secondary'
// 						>
// 							{t('Current image')}
// 						</Typography>
// 						<Button
// 							size='large'
// 							onClick={() => onImageChange('')}
// 							sx={{ mt: 0.5, textTransform: 'none', color: 'red' }}
// 						>
// 							{t('Remove image')}
// 						</Button>
// 					</Box>
// 				</Box>
// 			)}

// 			<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
// 				<Button
// 					component='label'
// 					variant='outlined'
// 					size='large'
// 					startIcon={<CloudUploadIcon />}
// 					disabled={uploadingImage}
// 					sx={{
// 						textTransform: 'none',
// 						borderRadius: 2,
// 						flex: 1,
// 						fontSize: 12
// 					}}
// 				>
// 					{uploadingImage ? t('Uploading...') : t('Upload Image')}
// 					<input
// 						type='file'
// 						hidden
// 						accept='image/*'
// 						onChange={handleFileSelect}
// 					/>
// 				</Button>

// 				{uploadingImage && <CircularProgress size={24} />}
// 			</Box>

// 			<TextField
// 				label={<Typography variant='h5'>{t('Or enter image URL manually')}</Typography>}
// 				fullWidth
// 				value={imageUrl}
// 				onChange={(e) => onImageChange(e.target.value)}
// 				size='medium'
// 				sx={{
// 					mt: 2,
// 					'& .MuiOutlinedInput-root': {
// 						borderRadius: 2,
// 						fontSize: 12
// 					}
// 				}}
// 				placeholder='https://example.com/image.jpg'
// 				helperText={<Typography>{t('Upload a file above or paste an image URL here')}</Typography>}
// 			/>
// 		</Box>
// 	);
// };

// interface MultiLanguageFieldProps {
// 	label: string;
// 	valueTh: string;
// 	valueEn: string;
// 	onChangeTh: (value: string) => void;
// 	onChangeEn: (value: string) => void;
// 	multiline?: boolean;
// 	rows?: number;
// 	placeholder?: string;
// 	required?: boolean;
// }

// const MultiLanguageField: React.FC<MultiLanguageFieldProps> = ({
// 	label,
// 	valueTh,
// 	valueEn,
// 	onChangeTh,
// 	onChangeEn,
// 	multiline = false,
// 	rows = 1,
// 	placeholder = '',
// 	required = false
// }) => {
// 	const { t , i18n } = useTranslation('Blog');
// 	const [activeTab, setActiveTab] = useState(i18n.language === 'th' ? 0 : 1);

// 	// Sync with i18n language changes
// 	useEffect(() => {
// 		setActiveTab(i18n.language === 'th' ? 0 : 1);
// 	}, [i18n.language]);

// 	return (
// 		<Card
// 			variant='outlined'
// 			sx={{ borderRadius: 3 }}
// 		>
// 			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
// 				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 0 }}>
// 					<Typography
// 						variant='h6'
// 						color='primary'
// 						sx={{ fontWeight: 600 }}
// 					>
// 						{label} {required && '*'}
// 					</Typography>
// 					<Chip
// 						icon={<LanguageIcon />}
// 						label={t('Multi Language')}
// 						size='small'
// 						color='secondary'
// 						variant='outlined'
// 					/>
// 				</Box>
// 				<Tabs
// 					value={activeTab}
// 					onChange={(e, newValue) => setActiveTab(newValue)}
// 					sx={{ px: 2 }}
// 				>
// 					<Tab label={t('🇹🇭 Thai')} />
// 					<Tab label={t('🇬🇧 English')} />
// 				</Tabs>
// 			</Box>
// 			<Box sx={{ p: 2 }}>
// 				{activeTab === 0 && (
// 					<TextField
// 						value={valueTh}
// 						onChange={(e) => onChangeTh(e.target.value)}
// 						fullWidth
// 						multiline={multiline}
// 						rows={rows}
// 						variant='outlined'
// 						placeholder={`${placeholder} (Thai)`}
// 						sx={{
// 							'& .MuiOutlinedInput-root': {
// 								borderRadius: 2,
// 								fontSize: multiline ? '1.4rem' : 14,
// 								fontFamily: multiline ? 'monospace' : 'inherit'
// 							}
// 						}}
// 					/>
// 				)}
// 				{activeTab === 1 && (
// 					<TextField
// 						value={valueEn}
// 						onChange={(e) => onChangeEn(e.target.value)}
// 						fullWidth
// 						multiline={multiline}
// 						rows={rows}
// 						variant='outlined'
// 						placeholder={`${placeholder} (English)`}
// 						sx={{
// 							'& .MuiOutlinedInput-root': {
// 								borderRadius: 2,
// 								fontSize: multiline ? '1.4rem' : 14,
// 								fontFamily: multiline ? 'monospace' : 'inherit'
// 							}
// 						}}
// 					/>
// 				)}
// 			</Box>
// 		</Card>
// 	);
// };

// interface EditBlogDialogProps {
// 	open: boolean;
// 	onClose: () => void;
// 	selectedBlog: BlogPost | null;
// 	onSave: (updatedData: any) => Promise<void>;
// 	categories: string[];
// }

// const EditBlogDialog: React.FC<EditBlogDialogProps> = ({ open, onClose, selectedBlog, onSave, categories }) => {
// 	const { t } = useTranslation('Blog');
// 	const [translations, setTranslations] = useState<{
// 		th: { id?: number; title: string; slug: string; content: string; excerpt: string };
// 		en: { id?: number; title: string; slug: string; content: string; excerpt: string };
// 	}>({
// 		th: { title: '', slug: '', content: '', excerpt: '' },
// 		en: { title: '', slug: '', content: '', excerpt: '' }
// 	});

// 	const [postData, setPostData] = useState({
// 		category_id: null as number | null,
// 		author_id: 1,
// 		featured_image: '',
// 		status: 'draft',
// 		published_at: null as string | null
// 	});

// 	const [uploadingImage, setUploadingImage] = useState<boolean>(false);

// 	useEffect(() => {
// 		if (open && selectedBlog) {
// 			// Load existing translations
// 			const thTrans = selectedBlog.translations?.find((t) => t.lang === 'th');
// 			const enTrans = selectedBlog.translations?.find((t) => t.lang === 'en');

// 			setTranslations({
// 				th: {
// 					id: thTrans?.id,
// 					title: thTrans?.title || '',
// 					slug: thTrans?.slug || '',
// 					content: thTrans?.content || '',
// 					excerpt: thTrans?.excerpt || ''
// 				},
// 				en: {
// 					id: enTrans?.id,
// 					title: enTrans?.title || '',
// 					slug: enTrans?.slug || '',
// 					content: enTrans?.content || '',
// 					excerpt: enTrans?.excerpt || ''
// 				}
// 			});

// 			setPostData({
// 				category_id: selectedBlog.category_id,
// 				author_id: selectedBlog.author_id,
// 				featured_image: selectedBlog.featured_image || '',
// 				status: selectedBlog.status,
// 				published_at: selectedBlog.published_at
// 			});
// 		}
// 	}, [open, selectedBlog]);

// 	const handleSave = async () => {
// 		if (!selectedBlog?.post_id) return;

// 		try {
// 			let publishedAt = postData.published_at;

// 			if (postData.status === 'published' && !publishedAt) {
// 				const now = new Date();
// 				publishedAt = now.toISOString();
// 			}

// 			// Build translations array
// 			const translationsArray = [];

// 			if (translations.th.title.trim() && translations.th.content.trim()) {
// 				translationsArray.push({
// 					...(translations.th.id && { id: translations.th.id }),
// 					lang: 'th',
// 					title: translations.th.title.trim(),
// 					slug: translations.th.slug.trim(),
// 					content: translations.th.content.trim(),
// 					excerpt: translations.th.excerpt.trim() || null
// 				});
// 			}

// 			if (translations.en.title.trim() && translations.en.content.trim()) {
// 				translationsArray.push({
// 					...(translations.en.id && { id: translations.en.id }),
// 					lang: 'en',
// 					title: translations.en.title.trim(),
// 					slug: translations.en.slug.trim(),
// 					content: translations.en.content.trim(),
// 					excerpt: translations.en.excerpt.trim() || null
// 				});
// 			}

// 			const requestBody = {
// 				category_id: postData.category_id,
// 				author_id: postData.author_id,
// 				featured_image: postData.featured_image || null,
// 				status: postData.status,
// 				published_at: publishedAt,
// 				translations: translationsArray
// 			};

// 			await onSave(requestBody);
// 			onClose();
// 		} catch (error) {
// 			console.error('Error in handleSave:', error);
// 		}
// 	};

// 	const getAuthorName = (author: Author | undefined) => {
// 		if (!author) return 'Unknown';

// 		return author.first_name && author.last_name ? `${author.first_name} ${author.last_name}` : author.username;
// 	};

// 	const formatDate = (dateString: string | null) => {
// 		if (!dateString) return 'Not set';

// 		const date = new Date(dateString);
// 		const pad = (n: number) => n.toString().padStart(2, '0');

// 		const day = pad(date.getDate());
// 		const month = pad(date.getMonth() + 1);
// 		const year = date.getFullYear();

// 		let hours = date.getHours();
// 		const ampm = hours >= 12 ? 'PM' : 'AM';
// 		hours = hours % 12;
// 		hours = hours ? hours : 12;
// 		const minutes = pad(date.getMinutes());

// 		return `${day}/${month}/${year} ${pad(hours)}:${minutes} ${ampm}`;
// 	};

// 	const hasValidTranslation =
// 		(translations.th.title.trim() && translations.th.content.trim()) ||
// 		(translations.en.title.trim() && translations.en.content.trim());

// 	return (
// 		<Dialog
// 			open={open}
// 			onClose={onClose}
// 			fullWidth
// 			maxWidth='lg'
// 			TransitionComponent={Zoom}
// 		>
// 			<DialogTitle sx={{ pb: 1 }}>
// 				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// 					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
// 						<Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
// 							<EditIcon />
// 						</Avatar>
// 						<Box>
// 							<Typography
// 								variant='h5'
// 								sx={{ fontWeight: 600 }}
// 							>
// 								{t('Edit Blog Post')}
// 							</Typography>
// 							<Typography
// 								variant='h6'
// 								color='text.secondary'
// 							>
// 								{t('Update your blog post details')}
// 							</Typography>
// 						</Box>
// 					</Box>
// 					<IconButton
// 						size='small'
// 						onClick={onClose}
// 					>
// 						<CloseIcon />
// 					</IconButton>
// 				</Box>
// 			</DialogTitle>

// 			<DialogContent
// 				dividers
// 				sx={{ py: 3 }}
// 			>
// 				<Grid
// 					container
// 					spacing={3}
// 				>
// 					<Grid
// 						item
// 						xs={12}
// 					>
// 						<MultiLanguageField
// 							label={t('Title')}
// 							valueTh={translations.th.title}
// 							valueEn={translations.en.title}
// 							onChangeTh={(value) =>
// 								setTranslations((prev) => ({ ...prev, th: { ...prev.th, title: value } }))
// 							}
// 							onChangeEn={(value) =>
// 								setTranslations((prev) => ({ ...prev, en: { ...prev.en, title: value } }))
// 							}
// 							placeholder={t('Enter blog post title')}
// 							required
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={6}
// 					>
// 						<Card
// 							variant='outlined'
// 							sx={{ p: 2, borderRadius: 3, height: '100%' }}
// 						>
// 							<Typography
// 								variant='h6'
// 								color='primary'
// 								sx={{ fontWeight: 600, mb: 1 }}
// 							>
// 								{t('Slug (TH) *')}
// 							</Typography>
// 							<TextField
// 								value={translations.th.slug}
// 								onChange={(e) =>
// 									setTranslations((prev) => ({ ...prev, th: { ...prev.th, slug: e.target.value } }))
// 								}
// 								fullWidth
// 								variant='outlined'
// 								placeholder='url-slug-th'
// 								InputProps={{
// 									startAdornment: <InputAdornment position='start'>/th/</InputAdornment>
// 								}}
// 								sx={{
// 									'& .MuiOutlinedInput-root': {
// 										borderRadius: 2,
// 										fontFamily: 'monospace',
// 										fontSize: 14
// 									}
// 								}}
// 							/>
// 						</Card>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={6}
// 					>
// 						<Card
// 							variant='outlined'
// 							sx={{ p: 2, borderRadius: 3, height: '100%' }}
// 						>
// 							<Typography
// 								variant='h6'
// 								color='primary'
// 								sx={{ fontWeight: 600, mb: 1 }}
// 							>
// 								{t('Slug (EN)')}
// 							</Typography>
// 							<TextField
// 								value={translations.en.slug}
// 								onChange={(e) =>
// 									setTranslations((prev) => ({ ...prev, en: { ...prev.en, slug: e.target.value } }))
// 								}
// 								fullWidth
// 								variant='outlined'
// 								placeholder='url-slug-en'
// 								InputProps={{
// 									startAdornment: <InputAdornment position='start'>/en/</InputAdornment>
// 								}}
// 								sx={{
// 									'& .MuiOutlinedInput-root': {
// 										borderRadius: 2,
// 										fontFamily: 'monospace',
// 										fontSize: 14
// 									}
// 								}}
// 							/>
// 						</Card>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<Card
// 							variant='outlined'
// 							sx={{ p: 2, borderRadius: 3, height: '100%' }}
// 						>
// 							<Typography
// 								variant='h6'
// 								color='primary'
// 								sx={{ fontWeight: 600, mb: 1 }}
// 							>
// 								{t('Status')}
// 							</Typography>
// 							<FormControl fullWidth>
// 								<Select
// 									value={postData.status}
// 									onChange={(e) => setPostData((prev) => ({ ...prev, status: e.target.value }))}
// 									sx={{ borderRadius: 2 }}
// 								>
// 									<MenuItem value='draft'>
// 										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// 											<Chip
// 												label={t('Draft')}
// 												size='small'
// 												color='warning'
// 											/>
// 											<Typography variant='h6'>{t('Draft')}</Typography>
// 										</Box>
// 									</MenuItem>
// 									<MenuItem value='published'>
// 										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// 											<Chip
// 												label={t('Published')}
// 												size='small'
// 												color='success'
// 											/>
// 											<Typography variant='h6'>{t('Published')}</Typography>
// 										</Box>
// 									</MenuItem>
// 								</Select>
// 							</FormControl>
// 						</Card>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<Card
// 							variant='outlined'
// 							sx={{ p: 2, borderRadius: 3, height: '100%' }}
// 						>
// 							<Typography
// 								variant='h6'
// 								color='primary'
// 								sx={{ fontWeight: 600, mb: 1 }}
// 							>
// 								{t('Category')}
// 							</Typography>
// 							<FormControl fullWidth>
// 								<Select
// 									value={postData.category_id || ''}
// 									onChange={(e) =>
// 										setPostData((prev) => ({
// 											...prev,
// 											category_id: e.target.value ? Number(e.target.value) : null
// 										}))
// 									}
// 									sx={{ borderRadius: 2 }}
// 									displayEmpty
// 								>
// 									<MenuItem value=''>
// 										<Typography
// 											variant='h6'
// 											color='text.secondary'
// 										>
// 											{t('No Category')}
// 										</Typography>
// 									</MenuItem>
// 									{categories.map((cat, index) => (
// 										<MenuItem
// 											key={cat}
// 											value={index + 1}
// 										>
// 											<Typography variant='h6'>{cat}</Typography>
// 										</MenuItem>
// 									))}
// 								</Select>
// 							</FormControl>
// 						</Card>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 					>
// 						<Card
// 							variant='outlined'
// 							sx={{ p: 2, borderRadius: 3, height: '100%' }}
// 						>
// 							<Typography
// 								variant='h6'
// 								color='primary'
// 								sx={{ fontWeight: 600, mb: 1 }}
// 							>
// 								{t('Author')}
// 							</Typography>
// 							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
// 								<Avatar
// 									sx={{
// 										width: 32,
// 										height: 32,
// 										bgcolor: 'primary.main',
// 										fontSize: '1.5rem',
// 										fontWeight: 600
// 									}}
// 								>
// 									{selectedBlog?.author
// 										? (
// 												selectedBlog.author.first_name?.[0] || selectedBlog.author.username[0]
// 											).toUpperCase()
// 										: '?'}
// 								</Avatar>
// 								<Box>
// 									<Typography
// 										variant='h6'
// 										sx={{ fontWeight: 500 }}
// 									>
// 										{selectedBlog?.author ? getAuthorName(selectedBlog.author) : 'Unknown'}
// 									</Typography>
// 									<Typography color='text.secondary'>
// 										@{selectedBlog?.author?.username || 'unknown'}
// 									</Typography>
// 								</Box>
// 							</Box>
// 						</Card>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 					>
// 						<Card
// 							variant='outlined'
// 							sx={{ p: 2, borderRadius: 3 }}
// 						>
// 							<ImageUploadField
// 								label={t('Featured Image')}
// 								imageUrl={postData.featured_image}
// 								onImageChange={(url) => setPostData((prev) => ({ ...prev, featured_image: url }))}
// 								uploadingImage={uploadingImage}
// 								setUploadingImage={setUploadingImage}
// 							/>
// 						</Card>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 					>
// 						<MultiLanguageField
// 							label={t('Excerpt')}
// 							valueTh={translations.th.excerpt}
// 							valueEn={translations.en.excerpt}
// 							onChangeTh={(value) =>
// 								setTranslations((prev) => ({ ...prev, th: { ...prev.th, excerpt: value } }))
// 							}
// 							onChangeEn={(value) =>
// 								setTranslations((prev) => ({ ...prev, en: { ...prev.en, excerpt: value } }))
// 							}
// 							multiline
// 							rows={3}
// 							placeholder={t('Brief summary of your blog post')}
// 						/>
// 					</Grid>

// 					<Grid
// 						item
// 						xs={12}
// 					>
// 						<MultiLanguageField
// 							label={t('Content')}
// 							valueTh={translations.th.content}
// 							valueEn={translations.en.content}
// 							onChangeTh={(value) =>
// 								setTranslations((prev) => ({ ...prev, th: { ...prev.th, content: value } }))
// 							}
// 							onChangeEn={(value) =>
// 								setTranslations((prev) => ({ ...prev, en: { ...prev.en, content: value } }))
// 							}
// 							multiline
// 							rows={12}
// 							placeholder={t('Start writing your blog content')}
// 							required
// 						/>
// 					</Grid>
// 				</Grid>
// 			</DialogContent>

// 			<DialogActions sx={{ p: 3, gap: 2, bgcolor: 'grey.50' }}>
// 				<Button
// 					onClick={onClose}
// 					variant='outlined'
// 					sx={{ px: 3, fontSize: 12 }}
// 					disabled={uploadingImage}
// 				>
// 					{t('Cancel')}
// 				</Button>
// 				<Button
// 					onClick={handleSave}
// 					variant='contained'
// 					color='primary'
// 					startIcon={<EditIcon />}
// 					sx={{ px: 4, fontSize: 12 }}
// 					disabled={!hasValidTranslation || uploadingImage}
// 				>
// 					{uploadingImage ? t('Uploading...') : t('Save Changes')}
// 				</Button>
// 			</DialogActions>
// 		</Dialog>
// 	);
// };

// export default EditBlogDialog;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogTitle, DialogContent, Button, IconButton, Box, Typography,
  TextField, InputAdornment, MenuItem, Select, FormControl, Avatar, Card, Grid, Chip,
  Zoom, CircularProgress, Tabs, Tab
} from '@mui/material';
import {
  Close as CloseIcon, Edit as EditIcon, CloudUpload as CloudUploadIcon,
  Image as ImageIcon, Language as LanguageIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface BlogTranslation { id?: number; blog_post_id: number; lang: 'th' | 'en'; title: string; slug: string; content: string; excerpt: string | null; }
interface BlogMedia { media_id: number; post_id: number; media_type: string; media_url: string; caption: string | null; display_order: number; }
interface BlogCategory { category_id: number; name: string; slug: string; description: string | null; }
interface Author { user_id: number; username: string; first_name: string | null; last_name: string | null; }
interface BlogPost {
  post_id: number; category_id: number | null; author_id: number; featured_image: string | null;
  status: string; published_at: string | null; created_at: string; updated_at: string;
  translations?: BlogTranslation[]; category?: BlogCategory; author?: Author; media?: BlogMedia[];
}

interface ImageUploadFieldProps {
  label: string; imageUrl: string; onImageChange: (url: string) => void;
  uploadingImage: boolean; setUploadingImage: (uploading: boolean) => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label, imageUrl, onImageChange, uploadingImage, setUploadingImage
}) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://myfarmsuk.com/api';
  const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`) : '';
  const { t } = useTranslation('Blog');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); return; }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_BASE_URL}/uploads`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      const result = await response.json();
      if (result.path) onImageChange(result.path);
      else throw new Error('No URL returned from upload');
    } catch (error: any) {
      console.error('Image upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>{label}</Typography>

      {imageUrl && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={fullImageUrl}
            sx={{ width: 80, height: 80, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            <ImageIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" color="text.secondary">{t('Current image')}</Typography>
            <Button size="large" onClick={() => onImageChange('')} sx={{ mt: 0.5, textTransform: 'none', color: 'red' }}>
              {t('Remove image')}
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          component="label" variant="outlined" size="large" startIcon={<CloudUploadIcon />} disabled={uploadingImage}
          sx={{ textTransform: 'none', borderRadius: 2, flex: 1, fontSize: 12 }}
        >
          {uploadingImage ? t('Uploading...') : t('Upload Image')}
          <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
        </Button>
        {uploadingImage && <CircularProgress size={24} />}
      </Box>

      <TextField
        label={<Typography variant="h5">{t('Or enter image URL manually')}</Typography>}
        fullWidth value={imageUrl} onChange={(e) => onImageChange(e.target.value)} size="medium"
        sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 12 } }}
        placeholder="https://example.com/image.jpg"
        helperText={<Typography>{t('Upload a file above or paste an image URL here')}</Typography>}
      />
    </Box>
  );
};

interface MultiLanguageFieldProps {
  label: string; valueTh: string; valueEn: string;
  onChangeTh: (value: string) => void; onChangeEn: (value: string) => void;
  multiline?: boolean; rows?: number; placeholder?: string; required?: boolean;
}

const MultiLanguageField: React.FC<MultiLanguageFieldProps> = ({
  label, valueTh, valueEn, onChangeTh, onChangeEn, multiline = false, rows = 1, placeholder = '', required = false
}) => {
  const { t, i18n } = useTranslation('Blog');
  const [activeTab, setActiveTab] = useState(i18n.language === 'th' ? 0 : 1);

  useEffect(() => { setActiveTab(i18n.language === 'th' ? 0 : 1); }, [i18n.language]);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 0 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            {label} {required && '*'}
          </Typography>
          <Chip icon={<LanguageIcon />} label={t('Multi Language')} size="small" color="secondary" variant="outlined" />
        </Box>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ px: 2 }}>
          <Tab label={t('🇹🇭 Thai')} />
          <Tab label={t('🇬🇧 English')} />
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        {activeTab === 0 && (
          <TextField
            value={valueTh} onChange={(e) => onChangeTh(e.target.value)} fullWidth multiline={multiline} rows={rows}
            variant="outlined" placeholder={`${placeholder} (Thai)`}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: multiline ? '1.4rem' : 14, fontFamily: multiline ? 'monospace' : 'inherit' } }}
          />
        )}
        {activeTab === 1 && (
          <TextField
            value={valueEn} onChange={(e) => onChangeEn(e.target.value)} fullWidth multiline={multiline} rows={rows}
            variant="outlined" placeholder={`${placeholder} (English)`}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: multiline ? '1.4rem' : 14, fontFamily: multiline ? 'monospace' : 'inherit' } }}
          />
        )}
      </Box>
    </Card>
  );
};

interface EditBlogDialogProps {
  open: boolean; onClose: () => void; selectedBlog: BlogPost | null;
  onSave: (updatedData: any) => Promise<void>; categories: string[];
}

const EditBlogDialog: React.FC<EditBlogDialogProps> = ({ open, onClose, selectedBlog, onSave, categories }) => {
  const { t } = useTranslation('Blog');

  const [translations, setTranslations] = useState<{
    th: { id?: number; title: string; slug: string; content: string; excerpt: string };
    en: { id?: number; title: string; slug: string; content: string; excerpt: string };
  }>({ th: { title: '', slug: '', content: '', excerpt: '' }, en: { title: '', slug: '', content: '', excerpt: '' } });

  const [postData, setPostData] = useState({
    category_id: null as number | null,
    author_id: 1,
    featured_image: '',
    status: 'draft',
    published_at: null as string | null
  });

  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  useEffect(() => {
    if (open && selectedBlog) {
      const thTrans = selectedBlog.translations?.find((t) => t.lang === 'th');
      const enTrans = selectedBlog.translations?.find((t) => t.lang === 'en');
      setTranslations({
        th: { id: thTrans?.id, title: thTrans?.title || '', slug: thTrans?.slug || '', content: thTrans?.content || '', excerpt: thTrans?.excerpt || '' },
        en: { id: enTrans?.id, title: enTrans?.title || '', slug: enTrans?.slug || '', content: enTrans?.content || '', excerpt: enTrans?.excerpt || '' }
      });
      setPostData({
        category_id: selectedBlog.category_id,
        author_id: selectedBlog.author_id,
        featured_image: selectedBlog.featured_image || '',
        status: selectedBlog.status,
        published_at: selectedBlog.published_at
      });
    }
  }, [open, selectedBlog]);

  const handleSave = async () => {
    if (!selectedBlog?.post_id) return;
    try {
      let publishedAt = postData.published_at;
      if (postData.status === 'published' && !publishedAt) {
        const now = new Date(); publishedAt = now.toISOString();
      }

      const translationsArray: any[] = [];
      if (translations.th.title.trim() && translations.th.content.trim()) {
        translationsArray.push({
          ...(translations.th.id && { id: translations.th.id }),
          lang: 'th', title: translations.th.title.trim(), slug: translations.th.slug.trim(),
          content: translations.th.content.trim(), excerpt: translations.th.excerpt.trim() || null
        });
      }
      if (translations.en.title.trim() && translations.en.content.trim()) {
        translationsArray.push({
          ...(translations.en.id && { id: translations.en.id }),
          lang: 'en', title: translations.en.title.trim(), slug: translations.en.slug.trim(),
          content: translations.en.content.trim(), excerpt: translations.en.excerpt.trim() || null
        });
      }

      const requestBody = {
        category_id: postData.category_id,
        author_id: postData.author_id,
        featured_image: postData.featured_image || null,
        status: postData.status,
        published_at: publishedAt,
        translations: translationsArray
      };

      await onSave(requestBody);
      onClose();
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };

  const getAuthorName = (author: Author | undefined) =>
    !author ? 'Unknown' : (author.first_name && author.last_name ? `${author.first_name} ${author.last_name}` : author.username);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(date.getDate()); const month = pad(date.getMonth() + 1); const year = date.getFullYear();
    let hours = date.getHours(); const ampm = hours >= 12 ? 'PM' : 'AM'; hours = hours % 12; hours = hours ? hours : 12;
    const minutes = pad(date.getMinutes());
    return `${day}/${month}/${year} ${pad(hours)}:${minutes} ${ampm}`;
  };

  const hasValidTranslation =
    (translations.th.title.trim() && translations.th.content.trim()) ||
    (translations.en.title.trim() && translations.en.content.trim());

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" TransitionComponent={Zoom}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 40, height: 40 }}>
              <EditIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{t('Edit Blog Post')}</Typography>
              <Typography variant="h6" color="text.secondary">{t('Update your blog post details')}</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MultiLanguageField
              label={t('Title')}
              valueTh={translations.th.title}
              valueEn={translations.en.title}
              onChangeTh={(v) => setTranslations((p) => ({ ...p, th: { ...p.th, title: v } }))}
              onChangeEn={(v) => setTranslations((p) => ({ ...p, en: { ...p.en, title: v } }))}
              placeholder={t('Enter blog post title')}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                {t('Slug (TH) *')}
              </Typography>
              <TextField
                value={translations.th.slug}
                onChange={(e) => setTranslations((p) => ({ ...p, th: { ...p.th, slug: e.target.value } }))}
                fullWidth variant="outlined" placeholder="url-slug-th"
                InputProps={{ startAdornment: <InputAdornment position="start">/th/</InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'monospace', fontSize: 14 } }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                {t('Slug (EN)')}
              </Typography>
              <TextField
                value={translations.en.slug}
                onChange={(e) => setTranslations((p) => ({ ...p, en: { ...p.en, slug: e.target.value } }))}
                fullWidth variant="outlined" placeholder="url-slug-en"
                InputProps={{ startAdornment: <InputAdornment position="start">/en/</InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'monospace', fontSize: 14 } }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                {t('Status')}
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={postData.status}
                  onChange={(e) => setPostData((prev) => ({ ...prev, status: e.target.value }))}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="draft">
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Chip
							label={t('Draft')}
							size="small"
							sx={{
								bgcolor: '#ffb74d',  
								color: '#ffffff',
								fontWeight: 600,
								'&:hover': { bgcolor: '#ffb74d' }
							}}
							/>
							<Typography variant="h6">{t('Draft')}</Typography>
						</Box>
					</MenuItem>


                  <MenuItem value="published">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* 🔒 ล็อกสีเดิมของ Published */}
                      <Chip
                        label={t('Published')}
                        size="small"
                        sx={{
                          bgcolor: '#81c784',
                          color: '#ffffff',
                          fontWeight: 600,
                          '&:hover': { bgcolor: '#81c784' }
                        }}
                      />
                      <Typography variant="h6">{t('Published')}</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                {t('Category')}
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={postData.category_id || ''}
                  onChange={(e) =>
                    setPostData((prev) => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : null }))
                  }
                  sx={{ borderRadius: 2 }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <Typography variant="h6" color="text.secondary">{t('No Category')}</Typography>
                  </MenuItem>
                  {categories.map((cat, index) => (
                    <MenuItem key={cat} value={index + 1}>
                      <Typography variant="h6">{cat}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                {t('Author')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: '1.5rem', fontWeight: 600 }}>
                  {selectedBlog?.author ? (selectedBlog.author.first_name?.[0] || selectedBlog.author.username[0]).toUpperCase() : '?'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {selectedBlog?.author ? getAuthorName(selectedBlog.author) : 'Unknown'}
                  </Typography>
                  <Typography color="text.secondary">@{selectedBlog?.author?.username || 'unknown'}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <ImageUploadField
                label={t('Featured Image')}
                imageUrl={postData.featured_image}
                onImageChange={(url) => setPostData((prev) => ({ ...prev, featured_image: url }))}
                uploadingImage={uploadingImage}
                setUploadingImage={setUploadingImage}
              />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <MultiLanguageField
              label={t('Excerpt')}
              valueTh={translations.th.excerpt}
              valueEn={translations.en.excerpt}
              onChangeTh={(v) => setTranslations((p) => ({ ...p, th: { ...p.th, excerpt: v } }))}
              onChangeEn={(v) => setTranslations((p) => ({ ...p, en: { ...p.en, excerpt: v } }))}
              multiline rows={3}
              placeholder={t('Brief summary of your blog post')}
            />
          </Grid>

          <Grid item xs={12}>
            <MultiLanguageField
              label={t('Content')}
              valueTh={translations.th.content}
              valueEn={translations.en.content}
              onChangeTh={(v) => setTranslations((p) => ({ ...p, th: { ...p.th, content: v } }))}
              onChangeEn={(v) => setTranslations((p) => ({ ...p, en: { ...p.en, content: v } }))}
              multiline rows={12}
              placeholder={t('Start writing your blog content')}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3, gap: 2,
          // เดิมใช้ grey.50 -> ทำให้รองรับทั้ง Light/Dark
          bgcolor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[50] : alpha('#fff', 0.02))
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ px: 3, fontSize: 12 }} disabled={uploadingImage}>
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleSave} variant="contained" color="primary" startIcon={<EditIcon />}
          sx={{ px: 4, fontSize: 12 }}
          disabled={!hasValidTranslation || uploadingImage}
        >
          {uploadingImage ? t('Uploading...') : t('Save Changes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBlogDialog;
