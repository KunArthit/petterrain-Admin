import FuseLayout from '@fuse/core/FuseLayout';
import { SnackbarProvider } from 'notistack';
import themeLayouts from 'src/components/theme-layouts/themeLayouts';
import { Provider } from 'react-redux';
import FuseSettingsProvider from '@fuse/core/FuseSettings/FuseSettingsProvider';
import { I18nProvider } from '@i18n/I18nProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale/en-US';
import { th } from 'date-fns/locale/th';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import Authentication from '@auth/Authentication';
import MainThemeProvider from '../contexts/MainThemeProvider';
import store from '@/store/store';
import routes from '@/configs/routesConfig';
import AppContext from '@/contexts/AppContext';
import useI18n from '@i18n/useI18n';
import { Locale } from 'date-fns';

// กำหนด locale mapping สำหรับ date-fns
const dateLocaleMap: Record<string, Locale> = {
	en: enUS,
	th: th
	// เพิ่มภาษาอื่นๆ ตามต้องการ
	// ja: ja,
	// ko: ko,
	// zh: zhCN,
};

/**
 * LocalizedApp - Component ที่ใช้ภาษาจาก I18nProvider
 * ต้องอยู่ภายใน I18nProvider เพื่อใช้ useI18n() ได้
 */
function LocalizedApp() {
	const { language } = useI18n();

	// เลือก locale สำหรับ date picker ตามภาษาที่เลือก
	const dateLocale = dateLocaleMap[language.id] || enUS;

	return (
		<LocalizationProvider
			dateAdapter={AdapterDateFns}
			adapterLocale={dateLocale}
		>
			<MainThemeProvider>
				<SnackbarProvider
					maxSnack={5}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right'
					}}
					classes={{
						containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99'
					}}
				>
					<FuseLayout layouts={themeLayouts} />
				</SnackbarProvider>
			</MainThemeProvider>
		</LocalizationProvider>
	);
}

/**
 * Main App Component
 */
function App() {
	const AppContextValue = {
		routes
	};

	return (
		<ErrorBoundary>
			<AppContext value={AppContextValue}>
				{/* Redux Store Provider */}
				<Provider store={store}>
					<Authentication>
						<FuseSettingsProvider>
							{/* I18n Provider - ต้องครอบ LocalizedApp */}
							<I18nProvider>
								{/* LocalizedApp จะใช้ภาษาจาก I18nProvider */}
								<LocalizedApp />
							</I18nProvider>
						</FuseSettingsProvider>
					</Authentication>
				</Provider>
			</AppContext>
		</ErrorBoundary>
	);
}

export default App;
