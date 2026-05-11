import { useState } from 'react'

export function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('pk_admin') === '1',
  )

  function login(password: string): boolean {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('pk_admin', '1')
      setAuthenticated(true)
      return true
    }
    return false
  }

  function logout() {
    sessionStorage.removeItem('pk_admin')
    setAuthenticated(false)
  }

  return { authenticated, login, logout }
}
