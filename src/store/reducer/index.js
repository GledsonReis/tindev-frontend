export const initialState = {
  isOauthed: JSON.parse(localStorage.getItem("isOauthed")) || false,
  gituser: JSON.parse(localStorage.getItem("gituser")) || null,
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: JSON.parse(localStorage.getItem("token")) || null,
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  proxy_url: process.env.REACT_APP_PROXY_URL
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "GITLOGIN": {
      localStorage.setItem("isOauthed", JSON.stringify(action.payload.isOauthed))
      localStorage.setItem("gituser", JSON.stringify(action.payload.gituser))
      return {
        ...state,
        isOauthed: action.payload.isOauthed,
        gituser: action.payload.gituser
      };
    }
    case "GITLOGOUT": {
      localStorage.clear()
      return {
        ...state,
        isOauthed: false,
        gituser: null
      };
    }
    case "LOGIN": {
      localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
      localStorage.setItem("user", JSON.stringify(action.payload.user))
      localStorage.setItem("token", JSON.stringify(action.payload.token))
      return {
        ...state,
        token: action.payload.token,
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user
      };
    }
    case "LOGOUT": {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      return {
        ...state,
        isLoggedIn: false,
        gituser: null,
        token: null
      };
    }
    default:
      return state;
  }
};