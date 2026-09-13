export const getFormattedUserName = (user) => {
  if (!user) return 'User';
  
  const raw = user.name || user.fullName || user.username || (user.email ? user.email.split('@')[0] : '');
  if (!raw) return 'User';

  // Replace dots, underscores, hyphens with spaces and capitalize each word
  const clean = raw
    .split(/[\._-]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return clean || 'User';
};
