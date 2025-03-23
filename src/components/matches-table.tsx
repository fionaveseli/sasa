import { Calendar, Clock } from "lucide-react"
import ShadcnTable from "@/components/table"
import type { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Match {
  id: string
  date: string
  time: string
  teamA: {
    name: string
    avatar: string
    score: number
  }
  teamB: {
    name: string
    avatar: string
    score: number
  }
}

interface MatchesTableProps {
  matches: Match[]
}

export default function MatchesTable({ matches }: MatchesTableProps) {
  const columns: ColumnDef<Match>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{row.original.date}</span>
        </div>
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{row.original.time}</span>
        </div>
      ),
    },
    {
      accessorKey: "teams",
      header: "Teams",
      cell: ({ row }) => (
        <div className="flex flex-col space-y-4">
          {/* Team A */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={row.original.teamA.avatar || "/placeholder.svg"}
                  alt={row.original.teamA.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span>{row.original.teamA.name}</span>
            </div>
            <Badge variant="outline" className="ml-auto">
              {row.original.teamA.score}
            </Badge>
          </div>

          {/* VS */}
          <div className="flex justify-center">
            <span className="text-sm font-medium text-gray-500">VS</span>
          </div>

          {/* Team B */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={row.original.teamB.avatar || "/placeholder.svg"}
                  alt={row.original.teamB.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span>{row.original.teamB.name}</span>
            </div>
            <Badge variant="outline" className="ml-auto">
              {row.original.teamB.score}
            </Badge>
          </div>
        </div>
      ),
    },
  ]

  return <ShadcnTable columns={columns} rows={matches} disablePaginations={true} />
}

