import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getAllPosts = () => api.get('/post')

export const getPostById = (postId) => api.get(`/post/${postId}`)

export const createPost = (postData) => api.post('/post', postData)

export const updatePost = (postId, postData) =>
  api.put(`/post/${postId}`, postData)

export const deletePost = (postId) =>
  api.delete(`/post/${postId}`)

export default api