import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { UpdateVendorUsers, Vendors } from 'src/helpers/entities';

type VendorsState = {
	vendor: Vendors[];
};

export const vendorslice = createSlice({
	name: 'vendor',
	initialState: {
		vendor: []
	} as VendorsState,
	reducers: {
		setVendors: (state, action: PayloadAction<Vendors[]>) => {
			state.vendor = action.payload;
		}
	}
});

export type vendorsliceType = typeof vendorslice;

type AppRootStateType = RootStateType<[vendorsliceType]>;

export const { setVendors } = vendorslice.actions;

export const getVendorUsersAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Vendors[] }>(`${END_POINT}/admin/vendors`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setVendors(res.data.data));
		return 'Vendor get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Deleting Vendor';
		}

		return 'Error Deleting Vendor';
	}
};

export const saveNewVendorAction =
	(body: Partial<Vendors>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/vendor`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});

			return 'Vendor added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Adding Vendor';
			}

			return 'Error Adding Vendor';
		}
	};

export const updateOldVendorAction =
	(id: string, body: Partial<UpdateVendorUsers>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/vendor/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Vendor';
			}

			return 'Error Updating Vendor';
		}
	};

export const deleteVendorAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/vendors/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted vendor';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting Vendor';
			}

			return 'Error Deleting Vendor';
		}
	};

export const selectVendors = (state: AppRootStateType) => state.vendor.vendor;

export default vendorslice.reducer;
