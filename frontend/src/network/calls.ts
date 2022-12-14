const BASE_URL = "/api/secrets";

type UnifiedRequestResponse = { message: string; error?: boolean };

export const fetchSecret = async (
  secretId: string
): Promise<UnifiedRequestResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${secretId}`);
    const messageContainer = await response.json();
    return { message: messageContainer.message, error: !response.ok };
  } catch {
    return { message: "", error: true };
  }
};

export const createSecret = async (
  message: string,
  duration: number,
  isEncrypted: boolean
): Promise<UnifiedRequestResponse> => {
  try {
    const creationResponse = await fetch(`${BASE_URL}`, {
      method: "POST",
      body: JSON.stringify({
        message,
        durationInMinutes: duration,
        isEncrypted,
      }),
    });
    const responseBody = await creationResponse.json();
    return { message: responseBody.messageId, error: !creationResponse.ok };
  } catch {
    return { message: "", error: true };
  }
};

export const deleteSecret = async (
  secretId: string
): Promise<UnifiedRequestResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${secretId}`, {
      method: "DELETE",
    });
    return { message: "", error: !response.ok };
  } catch {
    return { message: "", error: true };
  }
};

export const getSecretInfos = async (
  secretId: string
): Promise<{ isEncrypted: boolean; timeToExpiration: number } | undefined> => {
  try {
    const checkResponse = await fetch(`${BASE_URL}/${secretId}/infos`, {
      method: "GET",
    });
    const responseBody = await checkResponse.json();
    return checkResponse.ok ? responseBody : undefined;
  } catch {
    return undefined;
  }
};
