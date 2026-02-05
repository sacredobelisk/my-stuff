const getOrThrowIfNotFound = (name: string): string => {
  const variable = process.env[name];
  if (!variable) {
    throw new Error(`Environment variable ${name} not found`);
  }
  return variable.toString();
};

interface EnvVariable {
  BGA_AUTH_TOKEN: string;
}

export const PROCESS_ENVS: EnvVariable = {
  BGA_AUTH_TOKEN: getOrThrowIfNotFound("BGA_AUTH_TOKEN"),
};
