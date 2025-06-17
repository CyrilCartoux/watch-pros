import LogRocket from "logrocket";

export function initLogRocket() {
  if (typeof window !== "undefined") {
    LogRocket.init('wtf8c4/watch-pros');
}
}

export function identifyUser(userId: string, userData: {
  name?: string;
  email?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) {
  if (typeof window !== "undefined") {
    LogRocket.identify(userId, userData);
  }
} 