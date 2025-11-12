import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import CategoryTable from './components/CategoryTable';
import GlobalStyles from '@mui/material/GlobalStyles';
import CategoryHeader from './CategoryHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function GoogleAnalytics() {
	const { t } = useTranslation('GoogleAnalyticsPage');

	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className='w-full h-full flex flex-col px-16'>
				<CategoryHeader />
				<CategoryTable />
			</div>
		</>
	);
}

export default GoogleAnalytics;
