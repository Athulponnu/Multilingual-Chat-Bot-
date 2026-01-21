export const state = {
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
};
