// Mock data: single source of truth for Driver Profiles UI.
// UI must not mutate this module.

export const drivers = [
  {
    id: 'drv_001',
    name: 'Aisha Khan',
    licenseNumber: 'DL-4821-AX',
    licenseExpiryDate: '2027-05-14',
    licenseCategories: ['Van', 'Truck'],
    dutyStatus: 'On Duty',
    status: 'Available',
    safetyScore: 92,
  },
  {
    id: 'drv_002',
    name: 'Mateo Silva',
    licenseNumber: 'DL-1039-MS',
    licenseExpiryDate: '2024-11-02',
    licenseCategories: ['Van'],
    dutyStatus: 'Off Duty',
    status: 'Available',
    safetyScore: 76,
  },
  {
    id: 'drv_003',
    name: 'Chloe Martin',
    licenseNumber: 'DL-5590-CM',
    licenseExpiryDate: '2026-02-10',
    licenseCategories: ['Bike'],
    dutyStatus: 'Suspended',
    status: 'Available',
    safetyScore: 61,
  },
  {
    id: 'drv_004',
    name: 'Noah Johnson',
    licenseNumber: 'DL-7744-NJ',
    licenseExpiryDate: '2026-12-31',
    licenseCategories: ['Truck'],
    dutyStatus: 'On Duty',
    status: 'Available',
    safetyScore: 84,
  },
  {
    id: 'drv_005',
    name: 'Priya Patel',
    licenseNumber: 'DL-2207-PP',
    licenseExpiryDate: '2025-07-18',
    licenseCategories: ['Van'],
    dutyStatus: 'Off Duty',
    status: 'Available',
    safetyScore: 58,
  },
  {
    id: 'drv_006',
    name: 'Omar Haddad',
    licenseNumber: 'DL-9012-OH',
    licenseExpiryDate: '2028-03-09',
    licenseCategories: ['Van', 'Bike'],
    dutyStatus: 'Off Duty',
    status: 'Available',
    safetyScore: 88,
  },
];

export default drivers;
