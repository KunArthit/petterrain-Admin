import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { darken } from '@mui/material/styles';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useUser from '@auth/useUser';
import { useGetProjectDashboardProjectsQuery } from './ProjectDashboardApi';
import { useTranslation } from 'react-i18next';

/**
 * The ProjectDashboardAppHeader page.
 */
function ProjectDashboardAppHeader() {
	const { t } = useTranslation('projectPage');

	const { data: projects } = useGetProjectDashboardProjectsQuery();

	const { data: user, isGuest } = useUser();

	const [selectedProject, setSelectedProject] = useState<{ id: number; menuEl: HTMLElement | null }>({
		id: 1,
		menuEl: null
	});

	function handleChangeProject(id: number) {
		setSelectedProject({
			id,
			menuEl: null
		});
	}

	function handleOpenProjectMenu(event: React.MouseEvent<HTMLElement>) {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: event.currentTarget
		});
	}

	function handleCloseProjectMenu() {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: null
		});
	}

	return (
		<div className='flex flex-col w-full px-24 sm:px-32'>
			<div className='flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48'>
				<div className='flex flex-auto items-start min-w-0'>
					<Avatar
						sx={(theme) => ({
							background: (theme) => darken(theme.palette.background.default, 0.05),
							color: theme.palette.text.secondary
						})}
						className='flex-0 w-64 h-64 mt-4'
						alt={t('User photo')}
						src={user?.photoURL}
					>
						{user?.displayName?.[0]}
					</Avatar>
					<div className='flex flex-col min-w-0 mx-16'>
						<PageBreadcrumb />
						<Typography className='text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate'>
							{isGuest
								? t('Hi Guest!')
								: t('Welcome back, {{name}}!', { name: user?.displayName || user?.email })}
						</Typography>
					</div>
				</div>
				{/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-8">
					<Typography className="whitespace-nowrap text-primary font-medium">
						{t('Profile')}
					</Typography>
					<Typography className="whitespace-nowrap text-secondary font-medium">
						{t('Settings')}
					</Typography>
				</div> */}
			</div>
			{/*
      <div className="flex items-center">
        <Button
          onClick={handleOpenProjectMenu}
          className="flex items-center border border-solid border-b-0 rounded-b-0 h-36 px-16 text-md sm:text-base"
          sx={(theme) => ({
            backgroundColor: `${theme.palette.background.default}!important`,
            borderColor: theme.palette.divider,
          })}
          endIcon={
            <FuseSvgIcon size={16} color="action">
              heroicons-solid:chevron-down
            </FuseSvgIcon>
          }
        >
          {t(_.find(projects, ['id', selectedProject.id])?.name)}
        </Button>
        <Menu
          id="project-menu"
          anchorEl={selectedProject.menuEl}
          open={Boolean(selectedProject.menuEl)}
          onClose={handleCloseProjectMenu}
        >
          {projects &&
            projects.map((project) => (
              <MenuItem
                key={project.id}
                onClick={() => {
                  handleChangeProject(project.id);
                }}
              >
                {t(project.name)}
              </MenuItem>
            ))}
        </Menu>
      </div>
      */}
		</div>
	);
}

export default ProjectDashboardAppHeader;
