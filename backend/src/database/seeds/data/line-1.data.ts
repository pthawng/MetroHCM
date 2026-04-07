import { ITransitLine } from '../types';

export const line1Data: ITransitLine = {
  line: {
    code: 'L1',
    name: 'Tuyến số 1: Bến Thành – Suối Tiên',
    nameEn: 'Line 1: Ben Thanh – Suoi Tien',
    color: '#005596',
    totalLengthKm: 19.7,
    status: 'active',
  },
  stations: [
    { code: 'BT', name: 'Bến Thành', nameEn: 'Ben Thanh', lat: 10.7712, lng: 106.6981, type: 'underground', sequence: 1, km: 0 },
    { code: 'NHTP', name: 'Nhà hát Thành phố', nameEn: 'Opera House', lat: 10.7766, lng: 106.7032, type: 'underground', sequence: 2, km: 0.6 },
    { code: 'BS', name: 'Ba Son', nameEn: 'Ba Son', lat: 10.7818, lng: 106.7077, type: 'underground', sequence: 3, km: 1.2 },
    { code: 'TC', name: 'Tân Cảng', nameEn: 'Tan Cang', lat: 10.7935, lng: 106.7210, type: 'elevated', sequence: 4, km: 3.1 },
    { code: 'TD', name: 'Thảo Điền', nameEn: 'Thao Dien', lat: 10.8015, lng: 106.7305, type: 'elevated', sequence: 5, km: 4.2 },
    { code: 'AP', name: 'An Phú', nameEn: 'An Phu', lat: 10.8068, lng: 106.7402, type: 'elevated', sequence: 6, km: 5.2 },
    { code: 'RC', name: 'Rạch Chiếc', nameEn: 'Rach Chiec', lat: 10.8165, lng: 106.7538, type: 'elevated', sequence: 7, km: 6.9 },
    { code: 'PL', name: 'Phước Long', nameEn: 'Phuoc Long', lat: 10.8245, lng: 106.7645, type: 'elevated', sequence: 8, km: 9.0 },
    { code: 'BTH', name: 'Bình Thái', nameEn: 'Binh Thai', lat: 10.8305, lng: 106.7725, type: 'elevated', sequence: 9, km: 10.3 },
    { code: 'TDU', name: 'Thủ Đức', nameEn: 'Thu Duc', lat: 10.8425, lng: 106.7845, type: 'elevated', sequence: 10, km: 12.1 },
    { code: 'KCNC', name: 'Khu Công nghệ cao', nameEn: 'High-tech Park', lat: 10.8545, lng: 106.7965, type: 'elevated', sequence: 11, km: 14.3 },
    { code: 'DHQG', name: 'Đại học Quốc gia', nameEn: 'VNU-HCM', lat: 10.8655, lng: 106.8075, type: 'elevated', sequence: 12, km: 15.8 },
    { code: 'ST', name: 'Suối Tiên', nameEn: 'Suoi Tien', lat: 10.8755, lng: 106.8175, type: 'elevated', sequence: 13, km: 16.8 },
    { code: 'BXMDE', name: 'Bến xe Miền Đông mới', nameEn: 'New Mien Dong Bus Station', lat: 10.8855, lng: 106.8275, type: 'elevated', sequence: 14, km: 19.7 },
  ],
  depots: [
    { code: 'DP_LB', name: 'Depot Long Bình', lat: 10.8900, lng: 106.8350, capacity: 50 },
  ],
  trains: Array.from({ length: 17 }).map((_, i) => ({
    code: `T-L1-${String(i + 1).padStart(2, '0')}`,
    carCount: 3,
    capacityPerCar: 310,
    status: i < 9 ? 'active' : 'maintenance',
  })),
};
