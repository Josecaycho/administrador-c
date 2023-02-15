import { configureStore } from '@reduxjs/toolkit'
import campaniaReducer from './slices/campaniaSlice'

export const store = configureStore({
  reducer: {
    campania: campaniaReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch