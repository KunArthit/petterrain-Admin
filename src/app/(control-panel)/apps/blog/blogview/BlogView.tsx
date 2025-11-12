import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/system';
import { lazy } from 'react';
import BlogTable from '../component/BlogTable';
const MainContent = lazy(() => import('../component/MainContent'));

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

function BlogView() {
	const { t } = useTranslation('BlogPage');

	return (
		<Root
			content={
				<Container
					maxWidth='lg'
					component='main'
					sx={{ display: 'flex', flexDirection: 'column', my: 2, gap: 4 }}
				>
					<BlogTable />
				</Container>
			}
		/>
	);
}

export default BlogView;
