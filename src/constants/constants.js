const prod = {
  url: {
    BASE_URL: 'https://mord-os-api.herokuapp.com',
  }
};
const dev = {
  url: {
    BASE_URL: 'http://localhost:8080'
  }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
