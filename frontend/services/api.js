import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// GET all posts
export const getAllPosts = () => api.get('/post')

// GET single post
export const getPostById = (postId) => api.get(`/post/${postId}`)

// CREATE post
export const createPost = (postData) => api.post('/post', postData)

// UPDATE post
export const updatePost = (postId, postData) => api.put(`/post/${postId}`, postData)

// DELETE post
export const deletePost = (postId) => api.delete(`/post/${postId}`)

export default api