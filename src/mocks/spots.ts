import type { Spot } from '@/types'

export const mockSpots: Spot[] = [
  {
    id: 'cijin',
    name: '旗津',
    nameEn: 'Cijin',
    coordinates: [22.6080, 120.2652],
    type: 'surf',
    difficulty: 'beginner',
    description: '高雄旗津海水浴場，適合初學者，沙質海灘，設施完善',
  },
  {
    id: 'jinshan',
    name: '金山',
    nameEn: 'Jinshan',
    coordinates: [25.2228, 121.6383],
    type: 'surf',
    difficulty: 'intermediate',
    description: '新北金山磺港海灘，北海岸熱門衝浪點，浪況穩定',
  },
  {
    id: 'dulan',
    name: '都歷',
    nameEn: 'Dulan',
    coordinates: [22.9547, 121.2027],
    type: 'surf',
    difficulty: 'advanced',
    description: '台東都歷海灘，東海岸經典衝浪點，適合進階玩家',
  },
  {
    id: 'wai-mu-shan',
    name: '外木山',
    nameEn: 'Waimushan',
    coordinates: [25.1569, 121.7331],
    type: 'surf',
    difficulty: 'beginner',
    description: '基隆外木山，鄰近市區，適合新手練習',
  },
  {
    id: 'fulong',
    name: '福隆',
    nameEn: 'Fulong',
    coordinates: [25.0195, 121.9444],
    type: 'surf',
    difficulty: 'intermediate',
    description: '新北福隆海水浴場，知名沙灘，夏季熱門景點',
  },
  {
    id: 'yilan-station',
    name: '宜蘭測站',
    nameEn: 'Yilan Station',
    coordinates: [24.7571, 121.7547],
    type: 'station',
    description: '宜蘭近岸觀測站，提供即時海況監測',
  },
]

