import axios from 'axios'

export const callApi = async (method: string, endpoint: string, data: any) => {
  return await axios({
    method: method,
    url: `${import.meta.env.REACT_APP_API}cms/${endpoint}`,
    data: data,
    headers: { accept: 'application/json' }
  })
}
