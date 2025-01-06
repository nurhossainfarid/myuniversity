import { TSchedule } from './offeredCourse.interface'

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const start = new Date(schedule.startTime)
    const end = new Date(schedule.endTime)
    const newStart = new Date(newSchedule.startTime)
    const newEnd = new Date(newSchedule.endTime)

    if (newStart < end && newEnd > start) {
      return true
    }
  }

  return false
}
