export const commandOptionChecker = (options: object) => {
  const optionKeys = Object.keys(options);

  for (const key of optionKeys) {
    if (!process.argv.includes(key)) {
      throw new Error(`error: unknown option, the right option(s) are:  ${optionKeys}`);
    }
  }
};
