export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
};

function assertEnv(name: keyof typeof config) {
  if (!config[name] || typeof config[name] !== 'string') {
    throw new Error(`Missing required env var: ${name}`);
  }
}

// Validate at startup
assertEnv('apiBaseUrl');
assertEnv('googleClientId');
