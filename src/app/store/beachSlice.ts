import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Beach } from 'src/helpers/entities';

type beachState = {
	beach: Beach[];
};

export const beachSlice = createSlice({
	name: 'beach',
	initialState: {
		beach: []
	} as beachState,
	reducers: {
		setbeach: (state, action: PayloadAction<Beach[]>) => {
			state.beach = action.payload;
		}
	}
});

export type beachsliceType = typeof beachSlice;

type AppRootStateType = RootStateType<[beachsliceType]>;

const { setbeach } = beachSlice.actions;

export const getBeachAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Beach[] }>(`${END_POINT}/admin/beach`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setbeach(res.data.data));
		return 'Beach get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting Beach';
		}

		return 'Error Getting Beach';
	}
};

export const updateOldBeachAction =
	(id: string, body: Partial<Beach>): AppThunk<Promise<string>> =>
		async () => {
			try {
				await axios.put(`${END_POINT}/admin/beaches/${id}`, body, {
					headers: {
						'access-token': localStorage.getItem('jwt_access_token')
					}
				});
				return 'Updated successfully';
			} catch (error) {
				if (error && (error as AxiosError).response) {
					return (error.response.data.error as string) || 'Error Updating beach';
				}

				return 'Error Updating beach';
			}
		};

export const deleteBeachAction =
	(id: string): AppThunk<Promise<string>> =>
		async () => {
			try {
				await axios.delete(`${END_POINT}/admin/beach/${id}`, {
					headers: {
						'access-token': localStorage.getItem('jwt_access_token')
					}
				});
				return 'Deleted beach';
			} catch (error) {
				if (error && (error as AxiosError).response) {
					return (error.response.data.error as string) || 'Error Deleting beach';
				}

				return 'Error Deleting beach';
			}
		};

export const saveNewBeachAction =
	(body: Partial<Beach>): AppThunk<Promise<string>> =>
		async () => {
			try {
				await axios.post(`${END_POINT}/admin/beaches`, body, {
					headers: {
						'access-token': localStorage.getItem('jwt_access_token')
					}
				});
				return 'Beach Created succesfully';
			} catch (error) {
				if (error && (error as AxiosError).response) {
					return (error.response.data.error as string) || 'Error Creating beach';
				}

				return 'Error Creating beach';
			}
		};



export const selectBeach = (state: AppRootStateType) => state.beach.beach;

export default beachSlice.reducer;
