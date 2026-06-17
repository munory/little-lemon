import { getMinTime, initializeTimes, updateTimes } from './bookingUtils';

describe('getMinTime', () => {
  afterEach(() => jest.useRealTimers());

  test('rounds up to next 30-min slot', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-17T17:10:00'));
    expect(getMinTime()).toBe('17:30');
  });

  test('returns same slot when exactly on boundary', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-17T17:00:00'));
    expect(getMinTime()).toBe('17:00');
  });

  test('zero-pads hours and minutes', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-17T08:45:00'));
    expect(getMinTime()).toBe('09:00');
  });

  test('returns 23:30 when past the last slot of the day', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-17T23:45:00'));
    expect(getMinTime()).toBe('23:30');
  });
});

describe('initializeTimes', () => {
  test('returns available times for today from the API', () => {
    window.fetchAPI = jest.fn().mockReturnValue(['17:00', '18:00', '19:00']);
    const times = initializeTimes(new Date());
    expect(Array.isArray(times)).toBe(true);
    expect(times).toEqual(['17:00', '18:00', '19:00']);
  });
});

describe('updateTimes', () => {
  test('returns available times for the dispatched date', () => {
    window.fetchAPI = jest.fn().mockReturnValue(['20:00', '21:00']);
    const times = updateTimes([], { date: new Date('2026-12-31') });
    expect(times).toEqual(['20:00', '21:00']);
  });

  test('passes the date to fetchAPI', () => {
    const mockDate = new Date('2026-08-15');
    window.fetchAPI = jest.fn().mockReturnValue([]);
    updateTimes([], { date: mockDate });
    expect(window.fetchAPI).toHaveBeenCalledWith(mockDate);
  });
});
