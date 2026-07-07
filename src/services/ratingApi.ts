import axios from 'axios'
import { api } from '../lib/axios'

export type RatingProductType = 'SHOP' | 'RETAIL' | 'WHOLESALE'

export type RateProductPayload = {
  productType: RatingProductType
  productId: number | string
  rating: number
}

export type RateProductResponse = {
  rating?: number
  userRating?: number
  averageRating?: number
  raw?: any
}

function normalizeRatingResponse(response: any): RateProductResponse {
  const data = response?.data ?? response
  return {
    rating: data?.userRating ?? data?.rating,
    userRating: data?.userRating ?? data?.rating,
    averageRating: data?.averageRating,
    raw: data,
  }
}

async function postFallbackRating(payload: RateProductPayload) {
  const { productType, productId, rating } = payload

  if (productType === 'RETAIL') {
    console.log('Rating payload', payload)
    console.log('Stored token', localStorage.getItem('token'))
    console.log('Axios Authorization', api.defaults.headers.common.Authorization)
    const response = await api.post(`/retail/products/${productId}/rating`, { rating })
    return normalizeRatingResponse(response.data)
  }

  if (productType === 'WHOLESALE') {
    const response = await api.post(`/wholesale/products/${productId}/rating`, { rating })
    return normalizeRatingResponse(response.data)
  }

  const response = await api.post(`/products/${productId}/rating`, { rating })
  return normalizeRatingResponse(response.data)
}

export async function rateProduct(payload: RateProductPayload) {
  console.log('Rating payload', payload)
  console.log('Stored token', localStorage.getItem('token'))
  console.log('Axios Authorization', api.defaults.headers.common.Authorization)

  try {
    const state = (await import('../store/useAuthStore')).useAuthStore.getState()
    console.log('[ratingApi] user:', state.user)
    console.log('[ratingApi] token:', state.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null))

    if (payload.productType === 'RETAIL') {
      const response = await api.post(`/retail/products/${payload.productId}/rating`, { rating: payload.rating })
      return normalizeRatingResponse(response.data)
    }

    const response = await api.post('/ratings', {
      productType: payload.productType,
      productId: payload.productId,
      rating: payload.rating,
    })
    return normalizeRatingResponse(response.data)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.status)
      console.log(error.response?.data)
      console.log(error.config?.url)
      console.log(error.config?.method)
      console.log(error.config?.headers)
      console.log(error.config?.data)
    }

    if (
      axios.isAxiosError(error) &&
      error.response &&
      [404, 405].includes(error.response.status)
    ) {
      return postFallbackRating(payload)
    }

    const backendMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error
        ? error.message
        : 'Unable to save rating.'

    const enhancedError = new Error(backendMessage) as Error & {
      response?: { data?: { message?: string } }
    }
    enhancedError.response = {
      data: {
        message: backendMessage,
      },
    }

    throw enhancedError
  }
}
