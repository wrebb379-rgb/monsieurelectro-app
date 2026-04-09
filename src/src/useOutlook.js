import { useState } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, loginRequest, mailRequest } from './authConfig'

const msalInstance = new PublicClientApplication(msalConfig)
let initialized = false

export function useOutlook() {
  const [account, setAccount] = useState(null)
  const [courriels, setCourriels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function init() {
    if (!initialized) {
      await msalInstance.initialize()
      initialized = true
    }
  }

  async function connecter() {
    try {
      setLoading(true)
      setError(null)
      await init()
      const result = await msalInstance.loginPopup(loginRequest)
      setAccount(result.account)
      await chargerCourriels(result.account)
    } catch (e) {
      setError('Connexion annulée ou échouée')
    } finally {
      setLoading(false)
    }
  }

  async function chargerCourriels(acc) {
    try {
      setLoading(true)
      await init()
      const tokenResult = await msalInstance.acquireTokenSilent({
        ...mailRequest,
        account: acc,
      })

      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/messages?$top=25&$orderby=receivedDateTime desc&$filter=contains(subject,\'Monsieur Electro\') or from/emailAddress/address eq \'noreply@secureserver.net\'',
        {
          headers: {
            Authorization: `Bearer ${tokenResult.accessToken}`,
          },
        }
      )

      const data = await response.json()
      setCourriels(data.value || [])
    } catch (e) {
      setError('Erreur lors du chargement des courriels')
    } finally {
      setLoading(false)
    }
  }

  async function deconnecter() {
    await init()
    await msalInstance.logoutPopup()
    setAccount(null)
    setCourriels([])
  }

  return { account, courriels, loading, error, connecter, deconnecter, chargerCourriels: () => chargerCourriels(account) }
}