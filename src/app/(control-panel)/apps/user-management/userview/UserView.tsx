import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import UserTable from '../component/UserTable';

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

function UserView() {
	const { t } = useTranslation('UserPage');

	return (
		<Root
			// header={
			// 	<div className='p-24'>
			// 		<h4>{t('Manage User List')}</h4>
			// 	</div>
			// }
			content={<UserTable />}
		/>
	);
}

export default UserView;
