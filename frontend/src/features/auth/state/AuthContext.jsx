import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { httpClient, setUnauthorizedHandler } from '@/shared/api/httpClient'
import { ENDPOINTS } from '@/shared/api/endpoints'
import { storage } from '@/shared/storage/storage'
import { STORAGE_KEYS } from '@/shared/storage/storageKeys'
import { loginAccount } from '../api/authApi'
import { mergeMaintenance, maintenanceView } from './maintenanceStatus'

export const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => storage.get(STORAGE_KEYS.AUTH_SESSION))
  const [notice, setNotice] = useState('')
  const [authConfig, setAuthConfig] = useState(null)
  const [system, setSystem] = useState(null)
  const [now, setNow] = useState(Date.now)
  const exits = useRef(new Set())
  const registerExitHandler = useCallback((handler) => {
    exits.current.add(handler)
    return () => exits.current.delete(handler)
  }, [])
  const preserveProgress = useCallback((nextSession) => {
    for (const handler of exits.current) handler(nextSession)
  }, [])
  const invalidate = useCallback(
    (message = '') => {
      preserveProgress()
      storage.remove(STORAGE_KEYS.AUTH_SESSION)
      setNotice(message)
      setSession(null)
    },
    [preserveProgress],
  )
  const accept = useCallback((data) => {
    const next = {
      token: data.token,
      type: data.type,
      username: data.username,
      role: data.role,
      userId: data.userId,
    }
    storage.set(STORAGE_KEYS.AUTH_SESSION, next)
    setNotice('')
    setSession(next)
    return next
  }, [])
  const login = useCallback(
    async (credentials) => accept(await loginAccount(credentials)),
    [accept],
  )
  const loginGoogle = useCallback(
    async (input) => accept((await httpClient.post(ENDPOINTS.auth.google, input)).data),
    [accept],
  )
  const logout = useCallback(async () => {
    const token = storage.get(STORAGE_KEYS.AUTH_SESSION)?.token
    preserveProgress()
    try {
      await httpClient.post(ENDPOINTS.auth.logout)
    } catch {
      /* Local logout works offline. */
    }
    if (storage.get(STORAGE_KEYS.AUTH_SESSION)?.token === token) invalidate()
    globalThis.google?.accounts?.id?.disableAutoSelect()
  }, [invalidate, preserveProgress])
  const loadConfiguration = useCallback(async () => {
    try {
      setAuthConfig((await httpClient.get(ENDPOINTS.auth.config)).data)
    } catch {
      setAuthConfig({ unavailable: true })
    }
  }, [])
  const receiveSystem = useCallback((data) => {
    if (!data?.serverNow) return
    setSystem((previous) => mergeMaintenance(previous, data, Date.now()))
    setNow(Date.now())
  }, [])
  useEffect(() => {
    setUnauthorizedHandler(invalidate)
    return () => setUnauthorizedHandler(() => {})
  }, [invalidate])
  useEffect(() => {
    let active = true
    httpClient
      .get(ENDPOINTS.auth.config)
      .then(({ data }) => {
        if (active) setAuthConfig(data)
      })
      .catch(() => {
        if (active) setAuthConfig({ unavailable: true })
      })
    const refresh = async () => {
      try {
        const { data } = await httpClient.get(ENDPOINTS.system.status)
        if (active) receiveSystem(data)
      } catch {
        /* Keep the announced schedule offline. */
      }
    }
    refresh()
    const timer = setInterval(refresh, 15000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [receiveSystem])
  useEffect(() => {
    if (!session?.token) return
    let active = true
    const heartbeat = async () => {
      try {
        const { data } = await httpClient.post(ENDPOINTS.auth.session, {
          area: location.pathname === '/play' ? 'PLAY' : 'WEB',
        })
        if (active) receiveSystem(data.maintenance)
      } catch {
        /* 401 is handled centrally; network loss is not logout. */
      }
    }
    heartbeat()
    const timer = setInterval(heartbeat, 15000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [session?.token, receiveSystem])
  useEffect(() => {
    if (!system?.scheduled) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [system?.scheduled])
  useEffect(() => {
    const changed = (event) => {
      if (event.key !== STORAGE_KEYS.AUTH_SESSION) return
      const next = storage.get(STORAGE_KEYS.AUTH_SESSION)
      preserveProgress(next)
      setSession(next)
    }
    window.addEventListener('storage', changed)
    return () => window.removeEventListener('storage', changed)
  }, [preserveProgress])
  const maintenance = useMemo(() => maintenanceView(system, now), [system, now])
  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      login,
      loginGoogle,
      logout,
      notice,
      authConfig,
      loadConfiguration,
      maintenance,
      receiveSystem,
      registerExitHandler,
    }),
    [
      session,
      login,
      loginGoogle,
      logout,
      notice,
      authConfig,
      loadConfiguration,
      maintenance,
      receiveSystem,
      registerExitHandler,
    ],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
