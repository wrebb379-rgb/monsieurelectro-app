import { useState, useEffect } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './authConfig'

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

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
      const result = await msalInstance.handleRedirectPromise()
      if (result && result.account) {
        setAccount(result.account)
        await chargerCourriels(result.account)
      } else {
        const accounts = msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          setAccount(accounts[0])
          await chargerCourriels(accounts[0])
        }
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  async function connecter() {
    try {
      setLoading(true)
      setError(null)
      await msalInstance.loginRedirect({
        scopes: ['openid', 'profile', 'email', 'Mail.Read', 'User.Read'],
        prompt: 'select_account',
      })
    } catch (e) {
      console.error('Erreur connexion:', e)
      setError('Erreur: ' + e.message)
      setLoading(false)
    }
  }

  async function chargerCourriels(acc) {
    try {
      setLoading(true)
      const tokenResult = await msalInstance.acquireTokenSilent({
        scopes: ['Mail.Read'],
        account: acc,
      })

      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/messages?$top=50&$orderby=receivedDateTime desc&$select=id,subject,from,receivedDateTime,bodyPreview,body',
        {
          headers: {
            Authorization: 'Bearer ' + tokenResult.accessToken,
          },
        }
      )

      const data = await response.json()

      if (data.error) {
        setError('Erreur API: ' + data.error.message)
        return
      }

      const filtered = (data.value || []).filter(function(m) {
        const bodyTexte = stripHtml(m.body ? m.body.content : '')
        return (
          (m.subject && m.subject.includes('Monsieur Electro')) ||
          (m.bodyPreview && m.bodyPreview.includes('Monsieur Electro')) ||
          bodyTexte.includes('Monsieur Electro')
        )
      })

      const enriched = filtered.map(function(m) {
        return {
          ...m,
          bodyTexte: stripHtml(m.body ? m.body.content : ''),
        }
      })

      setCourriels(enriched)

    } catch (e) {
      console.error('Erreur courriels:', e)
      setError('Erreur chargement: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function deconnecter() {
    await msalInstance.logoutRedirect()
    setAccount(null)
    setCourriels([])
  }

  return {
    account, courriels, loading, error,
    connecter, deconnecter,
    chargerCourriels: () => chargerCourriels(account)
  }
}