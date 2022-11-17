module.exports = validateEmail = (email) => {
  // simple regular expression for email validate
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const isValidate = emailRegex.test(email);
  return isValidate;
};
