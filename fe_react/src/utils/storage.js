export const checkDataInLocalStorage = (data) => {
  if (!data || data === null || data === undefined || data === "null" || data === "undefined") {
    return false;
  }
  return true;
};

export const saveInfoToLocalStorage = (
  username,
  email,
  role,
  message,
  accessToken,
  refreshToken
) => {
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
  localStorage.setItem("role", role);
  localStorage.setItem("message", message);
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};
export const saveUserInfo = (username, email, role, message) => {
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
  localStorage.setItem("role", role);
  localStorage.setItem("message", message);
};

export const getUserName = () => {
  return localStorage.getItem("username");
};
export const getRole = () => {
  return localStorage.getItem("role");
};

export const getUserInfo = () => {
  const userInfo = {
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  };

  return userInfo;
};

export const clearInfoLocalStorage = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("message");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
export const clearAllToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getToken = () => {
  const token = localStorage.getItem("access_token");
  return token;
};

export const getRefreshToken = () => {
  const rfToken = localStorage.getItem("refresh_token");
  return rfToken;
};

export const getTimeExpr = () => {
  const time = localStorage.getItem("_timeExpr");
  return time;
};
export const setToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const setRefeshToken = (refeshToken) => {
  localStorage.setItem("refresh_token", refeshToken);
};
export const getAuthenticationName = () => {
  const username = localStorage.getItem("authenticationName");
  if (checkDataInLocalStorage(username)) {
    return username;
  }
  return "";
};

// export const getUserInfo = () => {
//     const userInfo = localStorage.getItem("_currentUser");

//     return JSON.parse(userInfo);
// };

// export const saveUserRemember = (username) => {
//     if (username) {
//         localStorage.setItem("username_rmb", username);
//     }
// };

// export const removeUserRemember = () => {
//     localStorage.removeItem("username_rmb");
// };

// export const getUsernameRemember = () => {
//     const username = localStorage.getItem("username_rmb");
//     if (checkDataInLocalStorage(username)) {
//         return username;
//     }
//     return "";
// };
