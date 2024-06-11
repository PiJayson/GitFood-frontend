export function passwordValidator(password) {
  if (!password) return "Password can't be empty.";
  if (password.length < 5)
    return "Password must be at least 5 characters long.";
  if (password.length > 30)
    return "Password must be at most 30 characters long.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one digit.";
  if (!/[a-zA-Z]/.test(password))
    return "Password must contain at least one letter.";
  if (/\s/.test(password)) return "Password must not contain white space.";

  return "";
}
