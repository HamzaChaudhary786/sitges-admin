import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Enterprises } from 'src/helpers/entities';

type enterprisesState = {
	enterprise: Enterprises[];
};

export const enterpriseSlice = createSlice({
	name: 'enterprise',
	initialState: {
		enterprise: []
	} as enterprisesState,
	reducers: {
		setEnterprises: (state, action: PayloadAction<Enterprises[]>) => {
			state.enterprise = action.payload;
		}
	}
});

export type enterpriseSliceType = typeof enterpriseSlice;

type AppRootStateType = RootStateType<[enterpriseSliceType]>;

const { setEnterprises } = enterpriseSlice.actions;

export const getEnterpriseAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Enterprises[] }>(`${END_POINT}/admin/enterprise`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setEnterprises(res.data.data));
		return 'Enterprise get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting enterprise';
		}

		return 'Error Getting enterprise';
	}
};

export const updateOldEnterpriseAction =
	(id: string, body: Partial<Enterprises>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/enterprise/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating enterprise';
			}

			return 'Error Updating enterprise';
		}
	};

export const deleteEnterpriseAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/enterprise/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted enterprise';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting enterprise';
			}

			return 'Error Deleting enterprise';
		}
	};

export const saveNewEnterpriseAction =
	(body: Partial<Enterprises>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/enterprise`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Enterprise Added succesfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Adding enterprise';
			}

			return 'Error Adding enterprise';
		}
	};

export const selectEnterprise = (state: AppRootStateType) => state.enterprise.enterprise;

export default enterpriseSlice.reducer;
