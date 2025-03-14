import { authService } from '../services/authService';

export const checkUserRole = () => {
  const user = authService.getCurrentUser();
  return user?.role || null;
};

export const isAdmin = () => {
  const role = checkUserRole();
  return role === 'admin';
};

export const isCoach = () => {
  const role = checkUserRole();
  return role === 'coach';
};

export const isPlayer = () => {
  const role = checkUserRole();
  return role === 'player';
};

export const getDashboardPath = (role: string | null) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'coach':
      return '/coach/dashboard';
    case 'player':
      return '/player/dashboard';
    default:
      return '/';
  }
};
