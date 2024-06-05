export const emailValidator = (email) => {
    const re = /\S+@\S+\.\S+/;
    if (!email) return "Email can't be empty.";
    if (!re.test(email)) return "Email has to contain @ and .";
    return '';
  };
  