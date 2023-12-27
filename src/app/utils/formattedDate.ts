/**
 * 
 * @param {string} date - date string in ISO format
 * @returns {string} - formatted string. example: N Days ago, today, In N Days.
 */
export function toDaysCount(date: string): string {
    if (!date) {
      return 'Not visited'
    }
    let time =  (new Date().getTime() - new Date(date).getTime()) / (3600 * 24 * 1000);
    let diff = time > 0 ? Math.floor(time) : Math.ceil(time)
    
    if (time > 0 &&  diff != 0) {
      return `${diff} Day${Math.abs(diff) > 1 ? 's' : ''} ago`;
    } else if (time < 0 &&  diff != 0) {
      return `In ${Math.abs(diff)} Day${Math.abs(diff) > 1 ? 's' : ''}`;
    } else {
      return 'today';
    }
  }