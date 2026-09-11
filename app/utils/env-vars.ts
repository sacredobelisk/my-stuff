const ENV_PREFIX = "VITE_";

interface EnvVariables {
  BGG_AUTH_TOKEN: string;
}

const readEnvVar = (name: keyof EnvVariables): string => {
  const key = `${ENV_PREFIX}${name}`;
  const value = import.meta.env[key];

  if (!value) {
    // Throwing here would run at module load and take the whole app down with a blank page. Warn
    // instead and let the request that needs the value fail, so the UI can show a real error.
    console.warn(`Environment variable ${key} is not set. Requests that need it will fail.`); // eslint-disable-line no-console
    return "";
  }

  return value;
};

export const PROCESS_ENVS: EnvVariables = {
  BGG_AUTH_TOKEN: readEnvVar("BGG_AUTH_TOKEN"),
};
