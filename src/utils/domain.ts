// TODO: Add more domains
export const VALID_DOMAINS = ['http://localhost:3000'];

export function getCurrentDomain(request: Request): string {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // Check if the hostname is one of our valid domains
  const domain = VALID_DOMAINS.find(d => hostname.endsWith(d));
  
  // Default to .fr if no valid domain is found
  return domain || 'http://localhost:3000';
}

export function getDomainUrl(domain: string): string {
  return `${domain}`;
} 