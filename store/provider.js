"use client"
import { Provider } from "react-redux"
import { store } from "./index"
import { hydrateAuth, setAuthReady } from "./slices/authSlice"
import { useEffect } from "react"

function AuthHydrator() {
  useEffect(() => {
    const raw = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (raw && token) {
      const parsed = JSON.parse(raw)
      // Normalize: ensure both id and _id exist regardless of what was stored
      const user = {
        ...parsed,
        id: parsed.id || parsed._id,
        _id: parsed._id || parsed.id,
      }
      store.dispatch(hydrateAuth({ user, token }))
    } else {
      store.dispatch(setAuthReady())
    }
  }, [])
  return null
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  )
}