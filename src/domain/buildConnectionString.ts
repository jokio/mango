export function buildConnectionString(
  connectionString: string,
  authMechanism: string,
) {
  let finalConnectionString = connectionString

  if (!connectionString.includes('authSource')) {
    finalConnectionString +=
      (!connectionString.includes('?') ? '?' : '&') +
      'authSource=admin'
  }

  if (
    !finalConnectionString.includes('authMechanism') &&
    authMechanism
  ) {
    finalConnectionString += '&' + `authMechanism=${authMechanism}`
  }

  return finalConnectionString
}
