import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../../../store/index'

// Define a type for the slice state
interface StoryState {
  alert: string
}

// Define the initial state using that type
const initialState: StoryState = {
  alert: ''
}

export const storySlice = createSlice({
  name: 'story',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    createStorySuccess: (state, action) => {
      state.alert = action.payload
    },
    updateStorySuccess: (state, action) => {
      state.alert = action.payload
    },
    setDefaultAlert: (state, action) => {
      state.alert = action.payload
    }
  }
})

export const { createStorySuccess, updateStorySuccess, setDefaultAlert } = storySlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectStory = (state: RootState) => state.story.alert

export default storySlice.reducer
