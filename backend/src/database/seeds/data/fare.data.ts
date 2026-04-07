export const fareData = {
  zones: [
    { code: 'Z1', name: 'Nội thành 1', description: 'Khu vực trung tâm' },
    { code: 'Z2', name: 'Nội thành 2', description: 'Khu vực cửa ngõ' },
    { code: 'Z3', name: 'Ngoại thành', description: 'Khu vực giáp ranh' },
  ],
  rules: [
    { 
      name: 'Chặng ngắn (< 5km)', 
      minKm: 0, 
      maxKm: 5, 
      price: 12000 
    },
    { 
      name: 'Chặng trung bình (5-10km)', 
      minKm: 5, 
      maxKm: 10, 
      price: 14000 
    },
    { 
      name: 'Chặng dài (10-15km)', 
      minKm: 10, 
      maxKm: 15, 
      price: 16000 
    },
    { 
      name: 'Toàn tuyến (> 15km)', 
      minKm: 15, 
      maxKm: 999, 
      price: 18000 
    },
  ],
};
