const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER_PROFILE_KEY = "user_profile";
const LANGUAGE = "language";

export const TokenService = {

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  },

  saveRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  },

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  },

  saveAccessToken(accessToken) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  },

  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN);
  },

};

export const UserService = {
  getUserProfile() {
    return localStorage.getItem(USER_PROFILE_KEY);
  },

  saveUserProfile(userProfile) {
    localStorage.setItem(USER_PROFILE_KEY, userProfile);
  },

  removeUserProfile() {
    localStorage.removeItem(USER_PROFILE_KEY);
  },
};

export const LanguageService = {
  getLanguage() {
    return localStorage.getItem(LANGUAGE);
  },

  saveLanguage(language) {
    localStorage.setItem(LANGUAGE, language);
  },

  removeLanguage() {
    localStorage.removeItem(LANGUAGE);
  },
};

