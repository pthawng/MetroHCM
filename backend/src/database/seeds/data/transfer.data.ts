export const transferData = [
  {
    fromLineCode: 'L1',
    fromStationCode: 'BT',
    toLineCode: 'L2', // Mock Line 2 for future-proofing
    toStationCode: 'BT',
    type: 'same_station',
    walkingTimeSec: 180, // 3 minutes
    walkingDistanceM: 150,
  },
  {
    fromLineCode: 'L2',
    fromStationCode: 'BT',
    toLineCode: 'L1',
    toStationCode: 'BT',
    type: 'same_station',
    walkingTimeSec: 180,
    walkingDistanceM: 150,
  },
];
