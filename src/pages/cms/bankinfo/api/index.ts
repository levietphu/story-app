import { callApi } from '../../api'

//get BankInfo
export const getBankInfo = async () => {
  return await callApi('get', 'bank_info/index', '')
}

//create BankInfo
export const createBankInfo = async (data: any) => {
  return await callApi('post', 'bank_info/create', data)
}

//update BankInfo
export const updateBankInfo = async (id: number, data: any) => {
  return await callApi('post', `bank_info/${id}/update`, data)
}

//delete BankInfo
export const deleteBankInfo = async (id: number) => {
  return await callApi('delete', `bank_info/${id}/delete`, '')
}
