// Code taken from https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
export const checkIfValidUUID = (potentialUUID: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(potentialUUID);
};

export enum SecretState {
  EXISTS = "exists",
  NOT_FOUND = "notFound",
  LOADING = "loading",
  HIDDEN = "hidden",
  ENCRYPTION_ERROR = "encryptionError",
}
