"use client"

import { useState, useEffect } from "react"

type NotificationItem = {
  id: string
  type: "LETTER" | "COMPLAINT"
  title: string
  subtitle: string
  time: string
  link: string
}

type AdminStats = {
  letters: number
  complaints: number
  total: number
  recent: NotificationItem[]
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({ letters: 0, complaints: 0, total: 0, recent: [] })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch admin stats", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // Optional: Polling every minute
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  return { stats, loading, refresh: fetchStats }
}
