import { callApi } from '../../api'

//get User
export const getUser = async () => {
  return await callApi('get', 'user/index', '')
}

// update role for user
export const updateRole = async (id_user: number, data: any) => {
  return await callApi('post', `user/${id_user}/update_role`, data)
}

//block User
export const blockUser = async (id: number) => {
  return await callApi('post', `user/${id}/block`, '')
}

//thêm xu
export const addCoin = async (id: number, data: any) => {
  return await callApi('post', `user/${id}/add_coin`, data)
}
