import axiosConfig from '../../../axios/axiosConfig';
import { cityActions } from './city-slice';
import { loaderActions } from '../../UI/Toast/store/loader/loader-slice';

export const createCity = value => {
  return async dispatch => {
    const onCreateCity = async () => {
      return axiosConfig.put('/city/create', { value });
    };

    try {
      const { data: cityData } = await onCreateCity();
      dispatch(cityActions.createNewCity(cityData));
      dispatch(loaderActions.showToast({ toastMessage: `${cityData.value} successfully created`, type: 'success' }));
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
};

export const fetchAllCities = () => {
  return async dispatch => {
    const onFetchAllCities = async () => {
      return axiosConfig.get('/city/all');
    };

    try {
      const { data: citiesData } = await onFetchAllCities();
      dispatch(cityActions.setAllCities(citiesData));
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
};
