import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Riders, UpdateRiderUsers } from 'src/helpers/entities';

type RidersState = {
	rider: Riders[];
};

export const riderslice = createSlice({
	name: 'rider',
	initialState: {
		rider: []
	} as RidersState,
	reducers: {
		setRiders: (state, action: PayloadAction<Riders[]>) => {
			state.rider = action.payload;
		}
	}
});

export type ridersliceType = typeof riderslice;

type AppRootStateType = RootStateType<[ridersliceType]>;

export const { setRiders } = riderslice.actions;

export const getRiderUsersAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Riders[] }>(`${END_POINT}/admin/riders`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});
		// console.log(res);

		dispatch(setRiders(res.data.data));
		return 'Rider get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting Rider';
		}

		return 'Error Getting Rider';
	}
};

export const updateOldRiderAction =
	(id: string, body: Partial<UpdateRiderUsers>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/rider/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Rider';
			}

			return 'Error Updating Rider';
		}
	};

export const saveNewRiderAction =
	(body: Partial<Riders>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/rider`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Rider Added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving Rider';
			}

			return 'Error Saving Rider';
		}
	};

export const deleteRiderAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/rider/riders/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted rider';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting Rider';
			}

			return 'Error Deleting Rider';
		}
	};

export const selectRiders = (state: AppRootStateType) => state.rider.rider;

export default riderslice.reducer;
