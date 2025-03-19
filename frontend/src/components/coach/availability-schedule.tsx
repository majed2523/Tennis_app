"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { coachService } from '../../services/coachService';
import { authService } from '../../services/authService';
import { Clock, Calendar, AlertCircle } from "lucide-react"

interface Availability {
  id: string
  coach_id: string
  day: string
  start_time: string
  end_time: string
}

export default function AvailabilitySchedule() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const userData = authService.getCurrentUser()
        if (!userData) {
          setError("User not authenticated")
          setIsLoading(false)
          return
        }

        const result = await coachService.getAvailability(userData.userId)
        if (result.error) {
          setError(result.error)
        } else {
          setAvailabilities(result)
        }
      } catch (err) {
        console.error("Error fetching availability:", err)
        setError("Failed to load availability schedule")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [])

  // Format time from 24h to 12h format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="bg-red-500/20 text-red-400 p-4 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Group availabilities by day
  const availabilityByDay = availabilities.reduce(
    (acc, availability) => {
      if (!acc[availability.day]) {
        acc[availability.day] = []
      }
      acc[availability.day].push(availability)
      return acc
    },
    {} as Record<string, Availability[]>,
  )

  // Order days of week
const daysOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const sortedDays = Object.keys(availabilityByDay).sort(
  (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
);


  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Your Availability Schedule
        </CardTitle>
        <CardDescription className="text-gray-400">Times when you're available to coach</CardDescription>
      </CardHeader>
      <CardContent>
        {availabilities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-500" />
            <p>No availability slots set yet.</p>
            <p className="text-sm mt-1">Add your availability to start coaching sessions.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDays.map((day) => (
              <div key={day} className="border-l-2 border-green-400 pl-4">
                <h3 className="font-bold text-lg text-white mb-2">{day}</h3>
                <div className="space-y-2">
                  {availabilityByDay[day].map((slot) => (
                    <div key={slot.id} className="bg-gray-700/50 p-3 rounded-md flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-green-400 mr-2" />
                        <span>
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </span>
                      </div>
                      <Badge className="bg-green-400/20 text-green-400">Available</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

