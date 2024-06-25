import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Admin, AdminUsers, UpdateAdminUsers } from 'src/helpers/entities';

type AdminsState = {
	admin: Admin[];
};

export const adminSlice = createSlice({
	name: 'admin',
	initialState: {
		admin: []
	} as AdminsState,
	reducers: {
		setAdmins: (state, action: PayloadAction<Admin[]>) => {
			state.admin = action.payload;
		}
	}
});

export type adminSliceType = typeof adminSlice;

type AppRootStateType = RootStateType<[adminSliceType]>;

const { setAdmins } = adminSlice.actions;

export const getAdminUsersAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Admin[] }>(`${END_POINT}/admin/admins`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setAdmins(res.data.data));
		return 'Admin get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting admin';
		}

		return 'Error Getting admin';
		return 'error';
	}
};

export const updateOldAdminAction =
	(id: string, body: Partial<UpdateAdminUsers>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/admins/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating admin';
			}

			return 'Error Updating admin';
		}
	};

export const deleteAdminAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/admins/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted admin';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting admin';
			}

			return 'Error Deleting admin';
		}
	};

export const saveNewAdminAction =
	(body: AdminUsers): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Admin Added succesfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error adding admin';
			}

			return 'Error adding admin';
		}
	};

export const selectAdmins = (state: AppRootStateType) => state.admin.admin;

export default adminSlice.reducer;
