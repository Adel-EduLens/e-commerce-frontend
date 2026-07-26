import axios from 'axios'
import { api } from '../lib/axios'

export type RatingProductType = 'SHOP' | 'RENTAL' | 'RETAIL' | 'WHOLESALE'

export type RateProductPayload = {
  productType: RatingProductType
  productId: number | string
  rating: number
}

export type RateProductResponse = {
  rating?: number
  userRating?: number
  averageRating?: number
  raw?: unknown
}

function normalizeRatingResponse(response: { data?: Record<string, unknown> } | Record<string, unknown>): RateProductResponse {
  const data = (response && 'data' in response && response.data ? response.data : response) as Record<string, unknown>
  return {
    rating: typeof data?.userRating === 'number' ? data.userRating : typeof data?.rating === 'number' ? data.rating : undefined,
    userRating: typeof data?.userRating === 'number' ? data.userRating : typeof data?.rating === 'number' ? data.rating : undefined,
    averageRating: typeof data?.averageRating === 'number' ? data.averageRating : undefined,
    raw: data,
  }
}

async function postFallbackRating(payload: RateProductPayload) {
  const { productType, productId, rating } = payload

  if (productType === 'RENTAL' || productType === 'RETAIL') {

    const response = await api.post(`/rental/products/${productId}/rating`, { rating })
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


  try {
    if (payload.productType === 'RENTAL' || payload.productType === 'RETAIL') {
      const response = await api.post(`/rental/products/${payload.productId}/rating`, { rating: payload.rating })
      return normalizeRatingResponse(response.data)
    }

    const response = await api.post('/ratings', {
      productType: payload.productType,
      productId: payload.productId,
      rating: payload.rating,
    })
    return normalizeRatingResponse(response.data)
  } catch (error: unknown) {

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
