import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/system';
import DepartmentTable from '../component/DepartmentTable';

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

function DepartmentView() {
	const { t } = useTranslation('DepartmentPage');

	return (
		<Root
			// header={
			// 	<div className='p-24'>
			// 		<h4>{t('Department View')}</h4>
			// 	</div>
			// }
			content={
				<Container
					maxWidth='lg'
					component='main'
					sx={{ display: 'flex', flexDirection: 'column', my: 2, gap: 4 }}
				>
					<DepartmentTable />
				</Container>
			}
		/>
	);
}

export default DepartmentView;
