export const ValidateEmail = email => {
  var reg =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  // /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(email);
};

export const HasText = text => {
  return !!text && text != '';
};

export const ValidatePassword = pswd => {
  const reg = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
  return reg.test(pswd);
};

export default {ValidateEmail, HasText, ValidatePassword};
