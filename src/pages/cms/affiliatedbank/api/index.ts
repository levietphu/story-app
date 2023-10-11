import { callApi } from '../../api'

//get AffiliatedBank
export const getAffiliatedBank = async (id_user: number) => {
  return await callApi('get', `affiliated_bank/index?id_user=${id_user}`, '')
}

//create AffiliatedBank
export const createAffiliatedBank = async (data: any) => {
  return await callApi('post', 'affiliated_bank/create', data)
}
