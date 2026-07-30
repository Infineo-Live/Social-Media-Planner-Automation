/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_COMPANY_NAME: string;
  readonly VITE_TIMEZONE: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_SHEET_ID: string;
  readonly VITE_APPS_SCRIPT_URL: string;
  readonly VITE_ENABLE_EMAIL_NOTIFICATIONS: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
