import { callApi } from '../../api'

//get Story
export const getStory = async () => {
  return await callApi('get', 'story/index', '')
}

//create Story
export const createStory = async () => {
  return await callApi('get', 'story/create', '')
}

//store story
export const storeStory = async (data: any) => {
  return await callApi('post', 'story/store', data)
}

//edit Story
export const editStory = async (id: number) => {
  return await callApi('get', `story/${id}/edit`, '')
}

//update Story
export const updateStory = async (id: number, data: any) => {
  return await callApi('put', `story/${id}/update`, data)
}

//delete Story
export const deleteStory = async (id: number) => {
  return await callApi('delete', `story/${id}/delete`, '')
}
