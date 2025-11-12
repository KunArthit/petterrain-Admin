import React, { useCallback } from 'react';
import {
	Box,
	Container,
	Paper,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Slide
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { CheckCircle } from '@mui/icons-material';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { FormHeader } from '@/components/FormHeader';
import { FormAlert } from '@/components/FormAlert';
import { FormStepper } from '@/components/FormStepper';
import { PersonalInfoStep } from '@/components/steps/PersonalInfoStep';
import { ContactInfoStep } from '@/components/steps/ContactInfoStep';
import { WorkExperienceStep } from '@/components/steps/WorkExperienceStep';
import { EducationSkillsStep } from '@/components/steps/EducationSkillsStep';
import { NavigationButtons } from '@/components/NavigationButtons';
import { PhotoUpload } from '@/components/uploads/PhotoUpload';
import { CertificateUpload } from '@/components/uploads/CertificateUpload';
import { CompletionDialog } from '@/components/CompletionDialog';
import { steps } from '@/constants';
import type { User, Contact, WorkExperience, Workplace, Education, Skills } from '@/types';

// Success Dialog Transition
const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return (
		<Slide
			direction='up'
			ref={ref}
			{...props}
		/>
	);
});

// Success Popup Component
interface SuccessPopupProps {
	open: boolean;
	title: string;
	message: string;
	onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ open, title, message, onClose }) => {
	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={onClose}
			aria-labelledby='success-dialog-title'
			PaperProps={{
				sx: {
					borderRadius: 3,
					minWidth: 400,
					textAlign: 'center'
				}
			}}
		>
			<DialogTitle
				id='success-dialog-title'
				sx={{
					pt: 4,
					pb: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 2
				}}
			>
				<Box
					sx={{
						width: 64,
						height: 64,
						borderRadius: '50%',
						backgroundColor: '#4caf50',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						animation: 'bounce 0.6s ease-in-out'
					}}
				>
					<CheckCircle sx={{ fontSize: 40, color: 'white' }} />
				</Box>
				<Typography
					variant='h6'
					sx={{ fontWeight: 600, color: '#2e7d32' }}
				>
					{title}
				</Typography>
			</DialogTitle>

			<DialogContent sx={{ textAlign: 'center', pb: 2 }}>
				<Typography
					variant='body1'
					sx={{ color: '#424242' }}
				>
					{message}
				</Typography>
			</DialogContent>

			<DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
				<Button
					onClick={onClose}
					variant='contained'
					sx={{
						backgroundColor: '#4caf50',
						'&:hover': { backgroundColor: '#388e3c' },
						borderRadius: 2,
						px: 4
					}}
				>
					ตกลง
				</Button>
			</DialogActions>

			<style>{`
        @keyframes bounce {
          0%, 20%, 60%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          80% {
            transform: translateY(-5px);
          }
        }
      `}</style>
		</Dialog>
	);
};

const RegisterForm: React.FC = () => {
	const {
		activeStep,
		loading,
		showPassword,
		alert,
		registrationComplete,
		userId,
		uploadLoading,
		photoFile,
		uploadedPhoto,
		uploadedCertificates,
		showCompletionDialog,
		certificateUploads,
		user,
		contact,
		workExperience,
		workplace,
		education,
		skills,
		setAlert,
		setPhotoFile,
		setShowCompletionDialog,
		setCertificateUploads,
		setUser,
		setContact,
		setWorkExperience,
		setWorkplace,
		setEducation,
		setSkills,
		setActiveStep,
		setLoading,
		setShowPassword,
		setRegistrationComplete,
		setUserId,
		setUploadLoading
	} = useRegistrationForm();
	const API_Endpoint = import.meta.env.VITE_API_BASE_URL;

	// Success popup state
	const [successPopup, setSuccessPopup] = React.useState({
		open: false,
		title: '',
		message: ''
	});

	const showSuccessPopup = useCallback((title: string, message: string) => {
		setSuccessPopup({
			open: true,
			title,
			message
		});
	}, []);

	const hideSuccessPopup = useCallback(() => {
		setSuccessPopup((prev) => ({ ...prev, open: false }));
	}, []);

	const handleNext = useCallback(() => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	}, [setActiveStep]);

	const handleBack = useCallback(() => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	}, [setActiveStep]);

	const handleUserChange = useCallback(
		(field: keyof User, value: string) => {
			setUser((prev) => ({ ...prev, [field]: value }));
		},
		[setUser]
	);

	const handleContactChange = useCallback(
		(field: keyof Contact, value: string) => {
			setContact((prev) => ({ ...prev, [field]: value }));
		},
		[setContact]
	);

	const handleWorkExperienceChange = useCallback(
		(field: keyof WorkExperience, value: string | number) => {
			setWorkExperience((prev) => ({ ...prev, [field]: value }));
		},
		[setWorkExperience]
	);

	const handleWorkplaceChange = useCallback(
		(field: keyof Workplace, value: string) => {
			setWorkplace((prev) => ({ ...prev, [field]: value }));
		},
		[setWorkplace]
	);

	const handleEducationChange = useCallback(
		(field: keyof Education, value: string | number) => {
			setEducation((prev) => ({ ...prev, [field]: value }));
		},
		[setEducation]
	);

	const handleSkillsChange = useCallback(
		(field: keyof Skills, value: string) => {
			setSkills((prev) => ({ ...prev, [field]: value }));
		},
		[setSkills]
	);

	const handleCertificateUploadChange = useCallback(
		(index: number, field: string, value: string | File | null) => {
			const updatedUploads = [...certificateUploads];

			if (field === 'file') {
				updatedUploads[index].file = value as File | null;
			} else {
				(updatedUploads[index] as any)[field] = value as string;
			}

			setCertificateUploads(updatedUploads);
		},
		[certificateUploads, setCertificateUploads]
	);

	const addCertificateUpload = useCallback(() => {
		setCertificateUploads([
			...certificateUploads,
			{
				file: null,
				certificate_name: '',
				issued_by: '',
				start_date: '',
				end_date: '',
				is_lifetime: 'false' // Default value for is_lifetime
			}
		]);
	}, [certificateUploads, setCertificateUploads]);

	const removeCertificateUpload = useCallback(
		(index: number) => {
			if (certificateUploads.length > 1) {
				setCertificateUploads(certificateUploads.filter((_, i) => i !== index));
			}
		},
		[certificateUploads, setCertificateUploads]
	);

	const handlePhotoUpload = useCallback(async () => {
		if (!photoFile || !userId) {
			console.log('Missing photoFile or userId:', { photoFile, userId });
			return;
		}

		setUploadLoading(true);
		try {
			const formData = new FormData();
			formData.append('file', photoFile);

			// console.log('Uploading photo for user:', userId);

			const response = await fetch(`${API_Endpoint}/users2/${userId}/upload-photo`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const responseData = await response.json();
				console.log('Photo upload response:', responseData);

				// Show success popup instead of alert
				showSuccessPopup('อัพโหลดรูปภาพสำเร็จ!', 'รูปภาพของคุณได้ถูกอัพโหลดเรียบร้อยแล้ว');

				setPhotoFile(null);

				const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;

				if (fileInput) fileInput.value = '';
			} else {
				const errorData = await response.json();
				throw new Error(`Photo upload failed: ${errorData.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Photo upload error:', error);
			setAlert({
				show: true,
				type: 'error',
				message: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (error as Error).message
			});
		}
		setUploadLoading(false);
	}, [photoFile, userId, setUploadLoading, showSuccessPopup, setPhotoFile, setAlert]);

	const handleCertificateUpload = useCallback(
		async (index: number) => {
			const cert = certificateUploads[index];

			if (!cert.file || !userId || !cert.certificate_name || !cert.issued_by) {
				setAlert({
					show: true,
					type: 'error',
					message: 'กรุณากรอกข้อมูลใบรับรองให้ครบถ้วน'
				});
				return;
			}

			setUploadLoading(true);
			try {
				const formData = new FormData();
				formData.append('file', cert.file);
				formData.append('certificate_name', cert.certificate_name);
				formData.append('issued_by', cert.issued_by);
				formData.append('start_date', cert.start_date);
				formData.append('end_date', cert.end_date);

				const response = await fetch(`${API_Endpoint}/users2/${userId}/upload-certificate`, {
					method: 'POST',
					body: formData
				});

				if (response.ok) {
					const responseData = await response.json();
					// console.log('Certificate upload response:', responseData);

					// Show success popup instead of alert
					showSuccessPopup(
						'อัพโหลดใบรับรองสำเร็จ!',
						`ใบรับรอง "${cert.certificate_name}" ได้ถูกอัพโหลดเรียบร้อยแล้ว`
					);

					const updatedUploads = [...certificateUploads];
					updatedUploads[index] = {
						file: null,
						certificate_name: '',
						issued_by: '',
						start_date: '',
						end_date: '',
						is_lifetime: 'false' // Default value for is_lifetime
					};
					setCertificateUploads(updatedUploads);
				} else {
					const errorData = await response.json();
					throw new Error(`Certificate upload failed: ${errorData.error || 'Unknown error'}`);
				}
			} catch (error) {
				console.error('Certificate upload error:', error);
				setAlert({
					show: true,
					type: 'error',
					message: 'เกิดข้อผิดพลาดในการอัพโหลดใบรับรอง: ' + (error as Error).message
				});
			}
			setUploadLoading(false);
		},
		[certificateUploads, userId, setUploadLoading, showSuccessPopup, setCertificateUploads, setAlert]
	);

	const handleSubmit = useCallback(async () => {
		setLoading(true);
		setAlert({ show: false, type: 'success', message: '' });

		const payload = {
			user: {
				...user,
				photo: user.photo || undefined
			},
			contact: {
				...contact,
				orcid_id: contact.orcid_id || undefined,
				google_scholar_id: contact.google_scholar_id || undefined,
				facebook: contact.facebook || undefined,
				linkedin: contact.linkedin || undefined,
				twitter: contact.twitter || undefined,
				line: contact.line || undefined
			},
			work_experience: workExperience,
			workplace,
			education,
			skills,
			certificates: []
		};

		try {
			const response = await fetch(`${API_Endpoint}/register2`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				const result = await response.json();
				const possibleUserId =
					result.user_id || result.id || result.userId || result.data?.id || result.data?.user_id;

				if (possibleUserId) {
					setUserId(possibleUserId);
					setRegistrationComplete(true);
					setAlert({
						show: true,
						type: 'success',
						message: 'การลงทะเบียนสำเร็จ! ตอนนี้คุณสามารถอัพโหลดรูปภาพและใบรับรองได้'
					});
				} else {
					setAlert({
						show: true,
						type: 'error',
						message: 'การลงทะเบียนสำเร็จ แต่ไม่สามารถอัพโหลดไฟล์ได้ เนื่องจากไม่พบ User ID'
					});
				}
			} else {
				throw new Error(`Registration failed with status: ${response.status}`);
			}
		} catch (error) {
			setAlert({
				show: true,
				type: 'error',
				message:
					'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง: ' + (error as Error).message
			});
		}

		setLoading(false);
	}, [
		setLoading,
		setAlert,
		user,
		contact,
		workExperience,
		workplace,
		education,
		skills,
		setUserId,
		setRegistrationComplete
	]);

	const renderStepContent = (step: number) => {
		if (registrationComplete) {
			return (
				<Box>
					<Typography
						variant='h6'
						sx={{ mb: 3, color: '#424242', textAlign: 'center' }}
					>
						อัพโหลดรูปภาพและใบรับรอง
					</Typography>

					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
						<PhotoUpload
							photoFile={photoFile}
							uploadedPhoto={uploadedPhoto}
							uploadLoading={uploadLoading}
							userId={userId}
							onPhotoFileChange={setPhotoFile}
							onPhotoUpload={handlePhotoUpload}
						/>

						<CertificateUpload
							certificateUploads={certificateUploads}
							uploadedCertificates={uploadedCertificates}
							uploadLoading={uploadLoading}
							onCertificateUploadChange={handleCertificateUploadChange}
							onAddCertificateUpload={addCertificateUpload}
							onRemoveCertificateUpload={removeCertificateUpload}
							onCertificateUpload={handleCertificateUpload}
						/>

						<Box sx={{ textAlign: 'center', mt: 3 }}>
							<Button
								onClick={() => setShowCompletionDialog(true)}
								variant='contained'
								size='large'
								sx={{
									backgroundColor: '#4caf50',
									'&:hover': { backgroundColor: '#388e3c' },
									borderRadius: 2,
									px: 4,
									py: 1.5,
									fontSize: '18px',
									fontWeight: 600
								}}
							>
								เสร็จสิ้นการลงทะเบียน
							</Button>
						</Box>
					</Box>
				</Box>
			);
		}

		switch (step) {
			case 0:
				return (
					<PersonalInfoStep
						user={user}
						showPassword={showPassword}
						onUserChange={handleUserChange}
						onTogglePassword={() => setShowPassword(!showPassword)}
					/>
				);
			case 1:
				return (
					<ContactInfoStep
						contact={contact}
						onContactChange={handleContactChange}
					/>
				);
			case 2:
				return (
					<WorkExperienceStep
						workExperience={workExperience}
						workplace={workplace}
						onWorkExperienceChange={handleWorkExperienceChange}
						onWorkplaceChange={handleWorkplaceChange}
					/>
				);
			case 3:
				return (
					<EducationSkillsStep
						education={education}
						skills={skills}
						onEducationChange={handleEducationChange}
						onSkillsChange={handleSkillsChange}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				width: '100vw',
				background: '#f4f6fa',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				py: { xs: 2, md: 4 }
			}}
		>
			<Paper
				elevation={4}
				sx={{
					backgroundColor: '#fff',
					maxWidth: '650px',
					width: '100%',
					mx: 'auto',
					borderRadius: 3,
					boxShadow: 3,
					p: { xs: 2, md: 4 },
					minHeight: { xs: '80vh', md: 'auto' },
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center'
				}}
			>
				<Container
					maxWidth='xl'
					sx={{ px: 0 }}
				>
					<FormHeader />

					<FormAlert
						alert={alert}
						onClose={() => setAlert({ ...alert, show: false })}
					/>

					<FormStepper
						activeStep={activeStep}
						steps={steps}
					/>

					<Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 3, md: 6 } }}>
						<Box sx={{ py: { xs: 3, md: 4 }, backgroundColor: '#ffffff' }}>
							{renderStepContent(activeStep)}

							{!registrationComplete && (
								<NavigationButtons
									activeStep={activeStep}
									totalSteps={steps.length}
									loading={loading}
									onBack={handleBack}
									onNext={handleNext}
									onSubmit={handleSubmit}
								/>
							)}
						</Box>
					</Box>

					<Box sx={{ textAlign: 'center', py: 4, borderTop: '1px solid #e0e0e0', mt: 4 }}>
						<Typography
							variant='body2'
							sx={{ color: '#757575' }}
						>
							© 2025 สกมช - ระบบลงทะเบียนสมาชิก
						</Typography>
					</Box>
				</Container>

				{/* Success Popup */}
				<SuccessPopup
					open={successPopup.open}
					title={successPopup.title}
					message={successPopup.message}
					onClose={hideSuccessPopup}
				/>

				{/* Completion Dialog */}
				{showCompletionDialog && (
					<CompletionDialog
						uploadedPhoto={uploadedPhoto}
						uploadedCertificates={uploadedCertificates}
						onClose={() => {
							setShowCompletionDialog(false);
							window.location.reload();
						}}
					/>
				)}
			</Paper>
		</Box>
	);
};

export default RegisterForm;
