import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Dispatchers, UpdateDispatcherUsers } from 'src/helpers/entities';

type DispatchersState = {
	dispatcher: Dispatchers[];
};

export const dispatcherslice = createSlice({
	name: 'dispatcher',
	initialState: {
		dispatcher: []
	} as DispatchersState,
	reducers: {
		setDispatchers: (state, action: PayloadAction<Dispatchers[]>) => {
			state.dispatcher = action.payload;
		}
	}
});

export type dispatchersliceType = typeof dispatcherslice;

type AppRootStateType = RootStateType<[dispatchersliceType]>;

export const { setDispatchers } = dispatcherslice.actions;

export const getDispatcherUsersAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Dispatchers[] }>(`${END_POINT}/admin/dispatchers`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});
		dispatch(setDispatchers(res.data.data));
		return 'Dispatcher get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting dispatcher';
		}

		return 'Error Getting dispatcher';
	}
};

export const updateOldDispatcherAction =
	(id: string, body: Partial<UpdateDispatcherUsers>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/dispatcher/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating dispatcher';
			}

			return 'Error Updating dispatcher';
		}
	};

export const saveNewDispatcherAction =
	(body: Partial<Dispatchers>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/dispatcher`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Dispatcher Added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving dispatcher';
			}

			return 'Error Saving dispatcher';
		}
	};

export const connectDipatcherToVendor =
	(id: string, body: Partial<{ dispatcherId: string }>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/vendor/${id}/new-dispatcher`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Dispatcher Connected successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Connecting dispatcher';
			}

			return 'Error Connecting dispatcher';
		}
	};

export const deleteDispatcherAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/dispatcher/dispatchers/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted dispatcher';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting dispatcher';
			}

			return 'Error Deleting dispatcher';
		}
	};

export const selectDispatchers = (state: AppRootStateType) => state.dispatcher.dispatcher;

export default dispatcherslice.reducer;
