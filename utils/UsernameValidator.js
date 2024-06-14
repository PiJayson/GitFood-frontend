export function usernameValidator(name) {
  if (!name) return "Name can't be empty.";
  if (name.length < 6) return "Name must be at least 6 characters long.";
  if (name.length > 30) return "Name must be at most 30 characters long.";
  if (/\s/.test(name)) return "Name must not contain white space.";

  return "";
}
