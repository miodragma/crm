export const authFieldsLoginConfig = [
  {
    id: '1234',
    keyType: 'username',
    isEyeContent: false,
    placeholder: 'Username',
    type: 'text',
    errorMessage: 'Username is required with minimum 5 length'
  },
  {
    id: '2345',
    keyType: 'password',
    isEyeContent: true,
    placeholder: 'Password',
    type: 'password',
    errorMessage: 'Password is required with minimum 5 length'
  }
];

export const authFieldsSignupConfig = [
  {
    id: '3456',
    keyType: 'confirmPassword',
    isEyeContent: true,
    placeholder: 'Confirm password',
    type: 'password',
    errorMessage: 'Confirm password is required'
  },
  {
    id: '4567',
    keyType: 'firstName',
    placeholder: 'First name',
    type: 'text',
    errorMessage: 'First name is required with minimum 5 length'
  },
  {
    id: '4261',
    keyType: 'lastName',
    placeholder: 'Last name',
    type: 'text',
    errorMessage: 'Last name is required with minimum 5 length'
  }
];
