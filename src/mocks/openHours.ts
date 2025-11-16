import type { OpenHoursData } from '@/types'

export const mockOpenHours: OpenHoursData = {
  // 旗津
  'poi_cijin_shower': {
    'mon': [{ open: '00:00', close: '23:59' }],
    'tue': [{ open: '00:00', close: '23:59' }],
    'wed': [{ open: '00:00', close: '23:59' }],
    'thu': [{ open: '00:00', close: '23:59' }],
    'fri': [{ open: '00:00', close: '23:59' }],
    'sat': [{ open: '00:00', close: '23:59' }],
    'sun': [{ open: '00:00', close: '23:59' }],
  },
  'poi_cijin_seafood': {
    'mon': [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:00' }],
    'tue': [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:00' }],
    'wed': [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:00' }],
    'thu': [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:00' }],
    'fri': [{ open: '11:00', close: '14:00' }, { open: '17:00', close: '21:00' }],
    'sat': [{ open: '11:00', close: '21:00' }],
    'sun': [{ open: '11:00', close: '21:00' }],
  },
  'poi_cijin_rental': {
    'mon': [{ open: '08:00', close: '18:00' }],
    'tue': [{ open: '08:00', close: '18:00' }],
    'wed': [{ open: '08:00', close: '18:00' }],
    'thu': [{ open: '08:00', close: '18:00' }],
    'fri': [{ open: '08:00', close: '18:00' }],
    'sat': [{ open: '07:00', close: '19:00' }],
    'sun': [{ open: '07:00', close: '19:00' }],
  },
  'poi_cijin_cafe': {
    'mon': [{ open: '10:00', close: '19:00' }],
    'tue': [{ open: '10:00', close: '19:00' }],
    'wed': [], // 週三公休
    'thu': [{ open: '10:00', close: '19:00' }],
    'fri': [{ open: '10:00', close: '21:00' }],
    'sat': [{ open: '09:00', close: '21:00' }],
    'sun': [{ open: '09:00', close: '20:00' }],
  },
  'poi_cijin_temple': {
    'mon': [{ open: '06:00', close: '21:00' }],
    'tue': [{ open: '06:00', close: '21:00' }],
    'wed': [{ open: '06:00', close: '21:00' }],
    'thu': [{ open: '06:00', close: '21:00' }],
    'fri': [{ open: '06:00', close: '21:00' }],
    'sat': [{ open: '06:00', close: '21:00' }],
    'sun': [{ open: '06:00', close: '21:00' }],
  },

  // 金山
  'poi_jinshan_shower': {
    'mon': [{ open: '08:00', close: '18:00' }],
    'tue': [{ open: '08:00', close: '18:00' }],
    'wed': [{ open: '08:00', close: '18:00' }],
    'thu': [{ open: '08:00', close: '18:00' }],
    'fri': [{ open: '08:00', close: '18:00' }],
    'sat': [{ open: '07:00', close: '19:00' }],
    'sun': [{ open: '07:00', close: '19:00' }],
  },
  'poi_jinshan_seafood': {
    'mon': [{ open: '11:00', close: '14:30' }, { open: '17:00', close: '20:00' }],
    'tue': [{ open: '11:00', close: '14:30' }, { open: '17:00', close: '20:00' }],
    'wed': [{ open: '11:00', close: '14:30' }, { open: '17:00', close: '20:00' }],
    'thu': [{ open: '11:00', close: '14:30' }, { open: '17:00', close: '20:00' }],
    'fri': [{ open: '11:00', close: '14:30' }, { open: '17:00', close: '20:30' }],
    'sat': [{ open: '11:00', close: '20:30' }],
    'sun': [{ open: '11:00', close: '20:00' }],
  },
  'poi_jinshan_rental': {
    'mon': [{ open: '09:00', close: '17:00' }],
    'tue': [{ open: '09:00', close: '17:00' }],
    'wed': [{ open: '09:00', close: '17:00' }],
    'thu': [{ open: '09:00', close: '17:00' }],
    'fri': [{ open: '09:00', close: '18:00' }],
    'sat': [{ open: '08:00', close: '18:00' }],
    'sun': [{ open: '08:00', close: '18:00' }],
  },
  'poi_jinshan_cafe': {
    'mon': [{ open: '11:00', close: '18:00' }],
    'tue': [], // 週二公休
    'wed': [{ open: '11:00', close: '18:00' }],
    'thu': [{ open: '11:00', close: '18:00' }],
    'fri': [{ open: '11:00', close: '20:00' }],
    'sat': [{ open: '10:00', close: '20:00' }],
    'sun': [{ open: '10:00', close: '19:00' }],
  },
  'poi_jinshan_hotspring': {
    'mon': [{ open: '10:00', close: '22:00' }],
    'tue': [{ open: '10:00', close: '22:00' }],
    'wed': [{ open: '10:00', close: '22:00' }],
    'thu': [{ open: '10:00', close: '22:00' }],
    'fri': [{ open: '10:00', close: '23:00' }],
    'sat': [{ open: '09:00', close: '23:00' }],
    'sun': [{ open: '09:00', close: '22:00' }],
  },

  // 都歷
  'poi_dulan_shower': {
    'mon': [{ open: '07:00', close: '19:00' }],
    'tue': [{ open: '07:00', close: '19:00' }],
    'wed': [{ open: '07:00', close: '19:00' }],
    'thu': [{ open: '07:00', close: '19:00' }],
    'fri': [{ open: '07:00', close: '19:00' }],
    'sat': [{ open: '07:00', close: '20:00' }],
    'sun': [{ open: '07:00', close: '20:00' }],
  },
  'poi_dulan_food': {
    'mon': [], // 週一公休
    'tue': [{ open: '11:30', close: '14:00' }, { open: '17:30', close: '20:00' }],
    'wed': [{ open: '11:30', close: '14:00' }, { open: '17:30', close: '20:00' }],
    'thu': [{ open: '11:30', close: '14:00' }, { open: '17:30', close: '20:00' }],
    'fri': [{ open: '11:30', close: '14:00' }, { open: '17:30', close: '20:30' }],
    'sat': [{ open: '11:30', close: '20:30' }],
    'sun': [{ open: '11:30', close: '20:00' }],
  },
  'poi_dulan_rental': {
    'mon': [{ open: '08:00', close: '18:00' }],
    'tue': [{ open: '08:00', close: '18:00' }],
    'wed': [{ open: '08:00', close: '18:00' }],
    'thu': [{ open: '08:00', close: '18:00' }],
    'fri': [{ open: '08:00', close: '18:00' }],
    'sat': [{ open: '07:00', close: '19:00' }],
    'sun': [{ open: '07:00', close: '19:00' }],
  },
  'poi_dulan_cafe': {
    'mon': [{ open: '12:00', close: '20:00' }],
    'tue': [{ open: '12:00', close: '20:00' }],
    'wed': [], // 週三公休
    'thu': [{ open: '12:00', close: '20:00' }],
    'fri': [{ open: '12:00', close: '22:00' }],
    'sat': [{ open: '11:00', close: '22:00' }],
    'sun': [{ open: '11:00', close: '21:00' }],
  },
  'poi_dulan_culture': {
    'mon': [{ open: '10:00', close: '18:00' }],
    'tue': [], // 週二公休
    'wed': [{ open: '10:00', close: '18:00' }],
    'thu': [{ open: '10:00', close: '18:00' }],
    'fri': [{ open: '10:00', close: '18:00' }],
    'sat': [{ open: '10:00', close: '19:00' }],
    'sun': [{ open: '10:00', close: '19:00' }],
  },
}

export function getOpenHours(poiId: string) {
  return mockOpenHours[poiId] || {}
}

export function isOpen(poiId: string, datetime: Date): boolean {
  const hours = mockOpenHours[poiId]
  if (!hours) return true // 假設如果沒有資料就是開放

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const dow = days[datetime.getDay()]
  const dayHours = hours[dow]

  if (!dayHours || dayHours.length === 0) return false // 公休

  const time = `${String(datetime.getHours()).padStart(2, '0')}:${String(datetime.getMinutes()).padStart(2, '0')}`

  return dayHours.some(period => {
    return time >= period.open && time <= period.close
  })
}

