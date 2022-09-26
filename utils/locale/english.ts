export default {
  PROVIDER_TYPE_REQUIRED: 'provider type is required.',
  PROVIDER_KEY_REQUIRED: 'provider key is required.',
  EMAIL_INVALID:'email is invalid.',
  USER_SCREEN_NAME_REQUIRED: 'user screen name is required.',
  INVALID_PROVIDER_TYPE: 'invalid provider type.',
  INVALID_LOGIN_CREDENTIALS: 'invalid login credentials.',
  SIGNATURE_VERIFICATION_FAILED: 'signature verification failed.',
  SIGNATURE_REQUIRED: 'signature is required.',
  NOT_IMPLEMENTED: 'not implemented yet.',
  USER_NOT_FOUND:  (errorData?: any): string =>`no user found against id:${errorData.id}.`,

  
};