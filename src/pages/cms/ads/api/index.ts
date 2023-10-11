import { callApi } from '../../api'

//get ads
export const getAds = async () => {
  return await callApi('get', 'ads/index', '')
}

//create ads
export const createAds = async (data: any) => {
  return await callApi('post', 'ads/create', data)
}

//update ads
export const updateAds = async (id: number, data: any) => {
  return await callApi('put', `ads/${id}/update`, data)
}

//hidden ads
export const hiddenAds = async (id: number) => {
  return await callApi('post', `ads/${id}/hidden`, '')
}
