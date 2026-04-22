import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: restore from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken) {
      setToken(savedToken)
    }
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        // ignore
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((newToken, userData) => {
    localStorage.setItem('auth_token', newToken)
    if (userData) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
    setToken(newToken)
    setUser(userData || null)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
