import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/user.slice'

// Legacy slices — kept minimal (new pages use react-query directly)
import { createSlice } from '@reduxjs/toolkit'
const empty = (name: string) => createSlice({ name, initialState: {}, reducers: {} }).reducer

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Legacy — not actively used by new pages
    books:         empty('books'),
    authors:       empty('authors'),
    libraries:     empty('libraries'),
    users:         empty('users'),
    categories:    empty('categories'),
    memberships:   empty('memberships'),
    members:       empty('members'),
    payments:      empty('payments'),
    'member-stats': empty('member-stats'),
    savedBooks:    empty('savedBooks'),
    readingProgress: empty('readingProgress'),
    notifications: empty('notifications'),
    category:      empty('category'),
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
