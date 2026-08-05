const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('authToken')
  return token ? `Bearer ${token}` : null
}

// Generic API client with error handling
const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    ...options,
  }

  // Build headers with correct Content-Type handling (skip for FormData)
  const headers = {
    ...options.headers,
  }
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  config.headers = headers

  // Add auth token if available
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = token
  }

  try {
    const response = await fetch(url, config)
    
    // Handle 401 Unauthorized (token expired)
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/signin'
      return
    }

    const data = await response.json()

    if (!response.ok) {
      // Handle validation errors (400 Bad Request)
      if (response.status === 400 && typeof data === 'object') {
        // Convert Django validation errors to readable format
        if (data.username || data.email || data.password) {
          const errorMessages = []
          if (data.username) errorMessages.push(`Username: ${data.username[0]}`)
          if (data.email) errorMessages.push(`Email: ${data.email[0]}`)
          if (data.password) errorMessages.push(`Password: ${data.password[0]}`)
          throw new Error(errorMessages.join('; '))
        }
      }
      throw new Error(data.detail || data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    googleLogin: (token) => apiClient('/auth/login/google/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
    register: (userData) => apiClient('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    refreshToken: () => apiClient('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') }),
    }),
    getUser: () => apiClient('/auth/profile/'),
    updateUser: (userData) => apiClient('/auth/profile/', {
      method: 'PATCH',
      body: userData instanceof FormData ? userData : JSON.stringify(userData),
    }),
  },

  // Blog endpoints
  blog: {
    getPosts: (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      return apiClient(`/blog/posts/?${queryString}`)
    },
    getPost: (id) => apiClient(`/blog/posts/${id}/`),
    createPost: (postData) => apiClient('/blog/posts/', {
      method: 'POST',
      body: postData instanceof FormData ? postData : JSON.stringify(postData),
    }),
    updatePost: (id, postData) => apiClient(`/blog/posts/${id}/`, {
      method: 'PATCH',
      body: postData instanceof FormData ? postData : JSON.stringify(postData),
    }),
    deletePost: (slug) => apiClient(`/blog/posts/${slug}/`, {
      method: 'DELETE',
    }),
    getCategories: () => apiClient('/blog/categories/'),
    getSeries: (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      return apiClient(`/blog/series/?${queryString}`)
    },
    getSeriesDetail: (slug) => apiClient(`/blog/series/${slug}/`),
    createSeries: (data) => apiClient('/blog/series/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateSeries: (slug, data) => apiClient(`/blog/series/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    deleteSeries: (slug) => apiClient(`/blog/series/${slug}/`, {
      method: 'DELETE',
    }),
    getSeasons: (seriesId) => apiClient(`/blog/seasons/?series=${seriesId}`),
    getSeasonDetail: (slug) => apiClient(`/blog/seasons/${slug}/`),
    createSeason: (data) => apiClient('/blog/seasons/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getSeasonEpisodes: (seasonSlug) => apiClient(`/blog/seasons/${seasonSlug}/episodes/`),
    getEvents: () => apiClient('/blog/events/'),
  },

  // File upload helper
  uploadFile: async (file, type = 'posts') => {
    const token = getAuthToken()
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/blog/upload-${type}/`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    return response.json()
  },

  // Reading Journal endpoints
  readingJournal: {
    getEntries: () => apiClient('/reading-journal/entries/'),
    createEntry: (data) => apiClient('/reading-journal/entries/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateEntry: (id, data) => apiClient(`/reading-journal/entries/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    deleteEntry: (id) => apiClient(`/reading-journal/entries/${id}/`, {
      method: 'DELETE',
    }),
    getBookmarks: () => apiClient('/reading-journal/bookmarks/'),
    addBookmark: (data) => apiClient('/reading-journal/bookmarks/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    removeBookmark: (postId) => apiClient(`/reading-journal/bookmarks/${postId}/`, {
      method: 'DELETE',
    }),
    updateProgress: (postId, data) => apiClient(`/reading-journal/progress/${postId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    getProgress: (postId) => apiClient(`/reading-journal/progress/${postId}/`),
  },

  // Newsletter endpoints
  newsletter: {
    subscribe: (email) => apiClient('/newsletter/subscribe/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  },
}

export default api
