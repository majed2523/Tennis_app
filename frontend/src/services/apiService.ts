// const BASE_URL = 'http://127.0.0.1:5000'; // ✅ Ensure Flask runs on this URL

import clientService from './ClientService';
import reservationService from './reservationService';
import {
  adminLogin,
  manageSchedule,
  manageCourtBookings,
  fetchSchedule,
  fetchBookings,
  fetchAdminRole,
} from './AdminService';

export {
  adminLogin,
  manageSchedule,
  manageCourtBookings,
  fetchSchedule,
  fetchBookings,
  fetchAdminRole,
};



export { clientService, reservationService };


