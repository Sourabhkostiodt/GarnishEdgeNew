import { createSlice } from '@reduxjs/toolkit';
import i18next from 'i18next';
import themeConfig from '../theme.config';

const defaultState = {
    sidebarColor: '#ffffff', // default white
    mainContentColor: '#fafafa', // default light background
    primaryColor: '#4361ee', // default primary color
    isDarkMode: false,
    mainLayout: 'app',
    theme: 'light',
    menu: 'vertical',
    layout: 'full',
    rtlClass: 'ltr',
    animation: '',
    navbar: 'navbar-sticky',
    locale: 'en',
    sidebar: false,
    pageTitle: '',
    languageList: [
        { code: 'zh', name: 'Chinese' },
        { code: 'da', name: 'Danish' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
    ],
    semidark: false,
};

const initialState = {
    sidebarColor: localStorage.getItem('sidebarColor') || defaultState.sidebarColor,
    mainContentColor: localStorage.getItem('mainContentColor') || defaultState.mainContentColor,
    primaryColor: localStorage.getItem('app_primaryColor') || localStorage.getItem('primaryColor') || defaultState.primaryColor,
    theme: localStorage.getItem('theme') || themeConfig.theme,
    menu: localStorage.getItem('menu') || themeConfig.menu,
    layout: localStorage.getItem('layout') || themeConfig.layout,
    rtlClass: localStorage.getItem('rtlClass') || themeConfig.rtlClass,
    animation: localStorage.getItem('animation') || themeConfig.animation,
    navbar: localStorage.getItem('navbar') || themeConfig.navbar,
    locale: localStorage.getItem('i18nextLng') || themeConfig.locale,
    isDarkMode: false,
    sidebar: localStorage.getItem('sidebar') || defaultState.sidebar,
    semidark: localStorage.getItem('semidark') || themeConfig.semidark,
    languageList: [
        { code: 'zh', name: 'Chinese' },
        { code: 'da', name: 'Danish' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
        { code: 'ae', name: 'Arabic' },
    ],
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 67, g: 97, b: 238 }; // Default fallback
};

const themeConfigSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        toggleTheme(state, { payload }) {
            payload = payload || state.theme; // light | dark | system
            localStorage.setItem('theme', payload);
            state.theme = payload;
            if (payload === 'light') {
                state.isDarkMode = false;
            } else if (payload === 'dark') {
                state.isDarkMode = true;
            } else if (payload === 'system') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    state.isDarkMode = true;
                } else {
                    state.isDarkMode = false;
                }
            }

            if (state.isDarkMode) {
                document.querySelector('body')?.classList.add('dark');
            } else {
                document.querySelector('body')?.classList.remove('dark');
            }
        },
        toggleMenu(state, { payload }) {
            payload = payload || state.menu; // vertical, collapsible-vertical, horizontal
            state.sidebar = false; // reset sidebar state
            localStorage.setItem('menu', payload);
            state.menu = payload;
        },
        toggleLayout(state, { payload }) {
            payload = payload || state.layout; // full, boxed-layout
            localStorage.setItem('layout', payload);
            state.layout = payload;
        },
        toggleRTL(state, { payload }) {
            payload = payload || state.rtlClass; // rtl, ltr
            localStorage.setItem('rtlClass', payload);
            state.rtlClass = payload;
            document.querySelector('html')?.setAttribute('dir', state.rtlClass || 'ltr');
        },
        toggleAnimation(state, { payload }) {
            payload = payload || state.animation; // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
            payload = payload?.trim();
            localStorage.setItem('animation', payload);
            state.animation = payload;
        },
        toggleNavbar(state, { payload }) {
            payload = payload || state.navbar; // navbar-sticky, navbar-floating, navbar-static
            localStorage.setItem('navbar', payload);
            state.navbar = payload;
        },
        toggleSemidark(state, { payload }) {
            payload = payload === true || payload === 'true' ? true : false;
            localStorage.setItem('semidark', payload);
            state.semidark = payload;
        },
        toggleLocale(state, { payload }) {
            payload = payload || state.locale;
            i18next.changeLanguage(payload);
            state.locale = payload;
        },
        toggleSidebar(state) {
            state.sidebar = !state.sidebar;
        },

        setPageTitle(state, { payload }) {
            document.title = `${payload} | GarnishEdge - Multipurpose Tailwind Dashboard Template`;
        },
        toggleSidebarColor(state, { payload }) {
        state.sidebarColor = payload || defaultState.sidebarColor;
        localStorage.setItem('sidebarColor', state.sidebarColor);
    },
    toggleMainContentColor(state, { payload }) {
        state.mainContentColor = payload || defaultState.mainContentColor;
        localStorage.setItem('mainContentColor', state.mainContentColor);
    },
        setPrimaryColor(state, { payload }) {
        state.primaryColor = payload || defaultState.primaryColor;

        // Store in a separate key that won't be cleared during logout
        localStorage.setItem('app_primaryColor', state.primaryColor);

        // Also store in the regular key for backward compatibility
        localStorage.setItem('primaryColor', state.primaryColor);

        // Update CSS custom property for primary color
        const root = document.documentElement;
        root.style.setProperty('--primary-color', state.primaryColor);

        // Convert hex to RGB for box-shadow calculations
        const rgb = hexToRgb(state.primaryColor);

        // Update Tailwind primary color classes
        const style = document.createElement('style');
        style.id = 'dynamic-primary-color';
        style.textContent = `
            .text-primary { color: ${state.primaryColor} !important; }
            .bg-primary { background-color: ${state.primaryColor} !important; }
            .border-primary { border-color: ${state.primaryColor} !important; }
            .hover\\:text-primary:hover { color: ${state.primaryColor} !important; }
            .hover\\:bg-primary:hover { background-color: ${state.primaryColor} !important; }
            .hover\\:border-primary:hover { border-color: ${state.primaryColor} !important; }
            .focus\\:border-primary:focus { border-color: ${state.primaryColor} !important; }
            .focus\\:ring-primary:focus { --tw-ring-color: ${state.primaryColor} !important; }
            .btn-primary { background-color: ${state.primaryColor} !important; border-color: ${state.primaryColor} !important; }
            .btn-outline-primary { color: ${state.primaryColor} !important; border-color: ${state.primaryColor} !important; }
            .btn-outline-primary:hover { background-color: ${state.primaryColor} !important; color: white !important; }
            .btn-outline-primary:focus { border-color: ${state.primaryColor} !important; box-shadow: 0 0 0 0.2rem rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important; }
            .btn-outline-primary:active { background-color: ${state.primaryColor} !important; border-color: ${state.primaryColor} !important; }
            .badge-outline-primary { color: ${state.primaryColor} !important; border-color: ${state.primaryColor} !important; }
            .badge-outline-primary:hover { background-color: ${state.primaryColor} !important; color: white !important; }
            .form-checkbox:checked { background-color: ${state.primaryColor} !important; border-color: ${state.primaryColor} !important; }
            .form-radio:checked { background-color: ${state.primaryColor} !important; border-color: ${state.primaryColor} !important; }
            .form-input:focus { border-color: ${state.primaryColor} !important; box-shadow: 0 0 0 0.2rem rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important; }
            .form-select:focus { border-color: ${state.primaryColor} !important; box-shadow: 0 0 0 0.2rem rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important; }
            .form-textarea:focus { border-color: ${state.primaryColor} !important; box-shadow: 0 0 0 0.2rem rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important; }
        `;

        // Remove existing dynamic style if it exists
        const existingStyle = document.getElementById('dynamic-primary-color');
        if (existingStyle) {
            existingStyle.remove();
        }

        document.head.appendChild(style);
    },
}
});

// Utility function to initialize primary color on app startup
export const initializePrimaryColor = () => {
    const primaryColor = localStorage.getItem('app_primaryColor') || localStorage.getItem('primaryColor') || '#4361ee';

    // Update CSS custom property for primary color
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);

    // Convert hex to RGB for box-shadow calculations
    const rgb = hexToRgb(primaryColor);

    // Update Tailwind primary color classes
    const style = document.createElement('style');
    style.id = 'dynamic-primary-color';
    style.textContent = `
        .text-primary { color: ${primaryColor} !important; }
        .bg-primary { background-color: ${primaryColor} !important; }
        .border-primary { border-color: ${primaryColor} !important; }
        .hover\\:text-primary:hover { color: ${primaryColor} !important; }
        .hover\\:bg-primary:hover { background-color: ${primaryColor} !important; }
        .hover\\:border-primary:hover { border-color: ${primaryColor} !important; }
        .focus\\:border-primary:focus { border-color: ${primaryColor} !important; }
        .focus\\:ring-primary:focus { --tw-ring-color: ${primaryColor} !important; }
        .btn-primary { background-color: ${primaryColor} !important; border-color: ${primaryColor} !important; }
        .btn-outline-primary { color: ${primaryColor} !important; border-color: ${primaryColor} !important; }
        .btn-outline-primary:hover { background-color: ${primaryColor} !important; color: white !important; }
        .btn-outline-primary:focus { border-color: ${primaryColor} !important; box-shadow: 0 0 0 0.2rem rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important; }
        .btn-outline-primary:active { background-color: ${primaryColor} !important; border-color: ${primaryColor} !important; }
        .badge-outline-primary { color: ${primaryColor} !important; border-color: ${primaryColor} !important; }
        .badge-outline-primary:hover { background-color: ${primaryColor} !important; color: white !important; }
        .form-checkbox:checked { background-color: ${primaryColor} !important; border-color: ${primaryColor} !important; }
        .form-radio:checked { background-color: ${primaryColor} !important; border-color: ${primaryColor} !important; }
        .form-input:focus { border-color: ${primaryColor} !important; box-shadow: 0 0 0 0.2rem rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important; }
        .form-select:focus { border-color: ${primaryColor} !important; box-shadow: 0 0 0 0.2rem rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important; }
        .form-textarea:focus { border-color: ${primaryColor} !important; box-shadow: 0 0 0 0.2rem rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important; }
    `;

    // Remove existing dynamic style if it exists
    const existingStyle = document.getElementById('dynamic-primary-color');
    if (existingStyle) {
        existingStyle.remove();
    }

    document.head.appendChild(style);
};

export const { toggleTheme, toggleMenu, toggleLayout, toggleRTL, toggleAnimation, toggleNavbar, toggleSemidark, toggleLocale, toggleSidebar, setPageTitle, toggleSidebarColor, toggleMainContentColor, setPrimaryColor } = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
