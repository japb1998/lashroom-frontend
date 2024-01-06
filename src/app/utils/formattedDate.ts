/**
 * 
 * @param {string} date - date string in ISO format
 * @returns {string} - formatted string. example: N Days ago, today, In N Days.
 */
export function toDaysCount(date: string): string {
    if (!date) {
      return 'Not visited'
    }
    let now  = new Date()
    let time =  (now.getTime() - new Date(date).getTime()) / (3600 * 24 * 1000);
    let today = new Date(date)
  
    return calculateDiff(time, now, today)
  }

function calculateDiff(time: number, dateA: Date, dateB: Date): string {
  if (time >= 0 && time <= 1 && dateA.getDay() == dateB.getDay() || time < 0 && time > -1 && dateA.getDay() == dateB.getDay()) {
    return 'today'
  }

  if (time <= -1 || time < 0 && time > -1 && dateA.getDay() !== dateB.getDay()) {
    return `In ${Math.abs(Math.ceil(time))} Day${Math.abs(Math.ceil(time)) > 1 ? 's' : ''}`
  }

  return `${Math.abs(Math.ceil(time))} Day${Math.abs(Math.ceil(time)) > 1 ? 's' : ''} ago`
}