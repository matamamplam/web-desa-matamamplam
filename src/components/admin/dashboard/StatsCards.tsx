interface Stat {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  trend?: string
  badge?: string
}

interface StatsCardsProps {
  stats: Stat[]
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Icon */}
          <div className={`inline-flex rounded-lg ${stat.color} p-3 text-white`}>
            {stat.icon}
          </div>

          {/* Value */}
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">
              {stat.value.toLocaleString("id-ID")}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-600">
              {stat.title}
            </p>
          </div>

          {/* Trend or Badge */}
          {stat.trend && (
            <p className="mt-2 text-xs text-green-600">{stat.trend}</p>
          )}
          {stat.badge && (
            <span className="mt-2 inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
              {stat.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
