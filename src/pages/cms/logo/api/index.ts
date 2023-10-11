import { callApi } from '../../api'

//get logo
export const getLogo = async () => {
  return await callApi('get', 'logo/index', '')
}

//create logo
export const createLogo = async (data: any) => {
  return await callApi('post', 'logo/create', data)
}

//update logo
export const updateLogo = async (id: number, data: any) => {
  return await callApi('put', `logo/${id}/update`, data)
}

//hidden logo
export const hiddenLogo = async (id: number) => {
  return await callApi('post', `logo/${id}/hidden`, '')
}
