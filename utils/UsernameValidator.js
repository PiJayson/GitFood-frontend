export function usernameValidator(name) {
  if (!name) return "Name can't be empty.";
  if (name.length < 5) return "Name must be at least 5 characters long.";
  if (name.length > 50) return "Name must be at most 50 characters long.";
  if (/\s/.test(name)) return "Name must not contain white space.";

  return "";
}
