const getOrThrowIfNotFound = (name: string): string => {
  const variable = import.meta.env[`VITE_${name}`];
  if (!variable) {
    throw new Error(`Environment variable VITE_${name} not found`);
  }
  return variable;
};

interface EnvVariables {
  BGG_AUTH_TOKEN: string;
}

export const PROCESS_ENVS: EnvVariables = {
  BGG_AUTH_TOKEN: getOrThrowIfNotFound("BGG_AUTH_TOKEN"),
};
