export const state = {
  /* ================= AUTH ================= */

  get token() {
    return localStorage.getItem("token");
  },

  set token(value: string | null) {
    if (value) {
      localStorage.setItem("token", value);
    } else {
      localStorage.removeItem("token");
    }
  },

  get userId() {
    return localStorage.getItem("userId");
  },

  set userId(value: string | null) {
    if (value) {
      localStorage.setItem("userId", value);
    } else {
      localStorage.removeItem("userId");
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  /* ================= LANGUAGE (ADD THIS) ================= */

  get sendLanguage() {
    return localStorage.getItem("sendLanguage") || "en";
  },

  set sendLanguage(value: string) {
    localStorage.setItem("sendLanguage", value);
  },

  get receiveLanguage() {
    return localStorage.getItem("receiveLanguage") || "en";
  },

  set receiveLanguage(value: string) {
    localStorage.setItem("receiveLanguage", value);
  },
};
