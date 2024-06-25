import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Promocode } from 'src/helpers/entities';

type promocodesState = {
	promocode: Promocode[];
};

export const promocodeSlice = createSlice({
	name: 'promocode',
	initialState: {
		promocode: []
	} as promocodesState,
	reducers: {
		setpromocodes: (state, action: PayloadAction<Promocode[]>) => {
			state.promocode = action.payload;
		}
	}
});

export type promocodesliceType = typeof promocodeSlice;

type AppRootStateType = RootStateType<[promocodesliceType]>;

const { setpromocodes } = promocodeSlice.actions;

export const getPromocodeAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Promocode[] }>(`${END_POINT}/admin/promocode`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setpromocodes(res.data.data));
		return 'Promocode get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting Promo Codes ';
		}

		return 'Error Getting Promo Codes ';
	}
};

export const updateOldPromocodeAction =
	(id: string, body: Partial<Promocode>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/promocode/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Promo Codes ';
			}

			return 'Error Updating Promo Codes ';
		}
	};

export const deletePromocodeAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/promocode/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted promocode';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting Promo Codes ';
			}

			return 'Error Deleting Promo Codes ';
		}
	};

export const saveNewPromocodeAction =
	(body: Partial<Promocode>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/promocode`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Promocode Created succesfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving Promo Codes ';
			}

			return 'Error Saving Promo Codes ';
		}
	};

export const selectpromocodes = (state: AppRootStateType) => state.promocode.promocode;

export default promocodeSlice.reducer;
