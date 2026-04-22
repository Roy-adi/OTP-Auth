import api from './axios'

export const sendOtp = async (mobile) => {
  const { data } = await api.post('/otp-send', { mobile })
  return data
}

export const loginUser = async (mobile) => {
  const { data } = await api.post('/login', { mobile })
  return data
}

export const registerUser = async (formData) => {
  const { data } = await api.post('/register', formData)
  return data
}

export const fetchPostDetails = async (userId = 90344) => {
  const { data } = await api.post(`/post-details?user_id=${userId}`)
  return data
}
