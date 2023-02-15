import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const campaniaSlice = createSlice({
  name: 'campania',
  initialState,
  reducers: {
    campania_seleccionada: (state, action) => {
      state.value = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { campania_seleccionada } = campaniaSlice.actions

export default campaniaSlice.reducer