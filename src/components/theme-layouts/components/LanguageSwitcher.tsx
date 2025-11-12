// import Button from '@mui/material/Button';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import MenuItem from '@mui/material/MenuItem';
// import Popover from '@mui/material/Popover';
// import Typography from '@mui/material/Typography';
// import { useState } from 'react';
// import Link from '@fuse/core/Link';
// import { LanguageType } from '@i18n/I18nContext';
// import useI18n from '@i18n/useI18n';

// /**
//  * The language switcher.
//  */
// function LanguageSwitcher() {
// 	const { language, languages, changeLanguage } = useI18n();

// 	const [menu, setMenu] = useState<null | HTMLElement>(null);

// 	const langMenuClick = (event: React.MouseEvent<HTMLElement>) => {
// 		setMenu(event.currentTarget);
// 	};

// 	const langMenuClose = () => {
// 		setMenu(null);
// 	};

// 	function handleLanguageChange(lng: LanguageType) {
// 		changeLanguage(lng.id);

// 		langMenuClose();
// 	}

// 	return (
// 		<>
// 			<Button
// 				className='border border-divider'
// 				onClick={langMenuClick}
// 			>
// 				<img
// 					className='mx-4 min-w-20'
// 					src={`/assets/images/flags/${language.flag}.svg`}
// 					alt={language.title}
// 				/>

// 				<Typography
// 					className='mx-4 font-semibold text-md uppercase'
// 					sx={(theme) => ({
// 						color: theme.palette.text.secondary,
// 						...theme.applyStyles('dark', {
// 							color: theme.palette.text.primary
// 						})
// 					})}
// 				>
// 					{language.id}
// 				</Typography>
// 			</Button>
// 			<Popover
// 				open={Boolean(menu)}
// 				anchorEl={menu}
// 				onClose={langMenuClose}
// 				anchorOrigin={{
// 					vertical: 'bottom',
// 					horizontal: 'center'
// 				}}
// 				transformOrigin={{
// 					vertical: 'top',
// 					horizontal: 'center'
// 				}}
// 				classes={{
// 					paper: 'py-8'
// 				}}
// 			>
// 				{languages.map((lng) => (
// 					<MenuItem
// 						key={lng.id}
// 						onClick={() => handleLanguageChange(lng)}
// 					>
// 						<ListItemIcon className='min-w-36'>
// 							<img
// 								className='min-w-20'
// 								src={`/assets/images/flags/${lng.flag}.svg`}
// 								alt={lng.title}
// 							/>
// 						</ListItemIcon>
// 						<ListItemText primary={lng.title} />
// 					</MenuItem>
// 				))}

// 				<MenuItem
// 					component={Link}
// 					to='/documentation/configuration/multi-language'
// 					onClick={langMenuClose}
// 					role='button'
// 				>
// 					<ListItemText primary='Learn More' />
// 				</MenuItem>
// 			</Popover>
// 		</>
// 	);
// }

// export default LanguageSwitcher;

import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
// import Link from '@fuse/core/Link';
import { LanguageType } from '@i18n/I18nContext';
import useI18n from '@i18n/useI18n';
import { useSnackbar } from 'notistack';

/**
 * The language switcher component with improved UX
 */
function LanguageSwitcher() {
	const { language, languages, changeLanguage } = useI18n();
	const { enqueueSnackbar } = useSnackbar();

	const [menu, setMenu] = useState<null | HTMLElement>(null);
	const [isChanging, setIsChanging] = useState(false);

	const langMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setMenu(event.currentTarget);
	};

	const langMenuClose = () => {
		setMenu(null);
	};

	const handleLanguageChange = async (lng: LanguageType) => {
		// ถ้ากำลังเปลี่ยนภาษาอยู่ หรือเลือกภาษาเดิม ให้ข้าม
		if (isChanging || lng.id === language.id) {
			langMenuClose();
			return;
		}

		try {
			setIsChanging(true);

			// เปลี่ยนภาษา
			await changeLanguage(lng.id);

			// แสดงข้อความสำเร็จ
			// enqueueSnackbar(`ภาษาถูกเปลี่ยนเป็น ${lng.title} แล้ว`, {
			// 	variant: 'success',
			// 	autoHideDuration: 2000
			// });

			langMenuClose();
		} catch (error) {
			console.error('Failed to change language:', error);

			// แสดงข้อความผิดพลาด
			enqueueSnackbar('ไม่สามารถเปลี่ยนภาษาได้ กรุณาลองใหม่อีกครั้ง', {
				variant: 'error',
				autoHideDuration: 3000
			});
		} finally {
			setIsChanging(false);
		}
	};

	return (
		<>
			<Button
				className='border border-divider'
				onClick={langMenuClick}
				disabled={isChanging}
				aria-label='เปลี่ยนภาษา'
			>
				{isChanging ? (
					<CircularProgress
						size={20}
						className='mx-4'
					/>
				) : (
					<>
						<img
							className='mx-4 min-w-20'
							src={`/assets/images/flags/${language.flag}.svg`}
							alt={language.title}
							loading='lazy'
						/>
						<Typography
							className='mx-4 font-semibold text-md uppercase'
							sx={(theme) => ({
								color: theme.palette.text.secondary,
								...theme.applyStyles('dark', {
									color: theme.palette.text.primary
								})
							})}
						>
							{language.id}
						</Typography>
					</>
				)}
			</Button>

			<Popover
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={langMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
				{languages.map((lng) => (
					<MenuItem
						key={lng.id}
						onClick={() => handleLanguageChange(lng)}
						disabled={isChanging}
						selected={lng.id === language.id}
						sx={{
							'&.Mui-selected': {
								backgroundColor: 'action.selected',
								'&:hover': {
									backgroundColor: 'action.hover'
								}
							}
						}}
					>
						<ListItemIcon className='min-w-36'>
							<img
								className='min-w-20'
								src={`/assets/images/flags/${lng.flag}.svg`}
								alt={lng.title}
								loading='lazy'
							/>
						</ListItemIcon>
						<ListItemText
							primary={lng.title}
							secondary={lng.id === language.id ? 'กำลังใช้งาน' : undefined}
						/>
					</MenuItem>
				))}

				{/* <MenuItem
					component={Link}
					to='/documentation/configuration/multi-language'
					onClick={langMenuClose}
					role='button'
					disabled={isChanging}
					sx={{
						borderTop: 1,
						borderColor: 'divider',
						mt: 1,
						pt: 1
					}}
				>
					<ListItemText
						primary='เรียนรู้เพิ่มเติม'
						primaryTypographyProps={{
							color: 'primary'
						}}
					/>
				</MenuItem> */}
			</Popover>
		</>
	);
}

export default LanguageSwitcher;
