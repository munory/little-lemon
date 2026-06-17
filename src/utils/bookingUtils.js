export function getMinTime() {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const rounded = Math.ceil(totalMinutes / 30) * 30;
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  if (h >= 24) return '23:30';
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function fetchAvailableTimes(date) {
  if (typeof window !== 'undefined' && typeof window.fetchAPI === 'function') {
    return window.fetchAPI(date);
  }
  return ['17:00', '18:00', '19:00', '20:00', '21:00'];
}

export function submitReservation(formData) {
  if (typeof window !== 'undefined' && typeof window.submitAPI === 'function') {
    return window.submitAPI(formData);
  }
  return true;
}

export function initializeTimes(date) {
  return fetchAvailableTimes(date);
}

export function updateTimes(state, action) {
  return fetchAvailableTimes(action.date);
}
