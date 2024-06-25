import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Promotionalcode } from 'src/helpers/entities';

type promotionalcodesState = {
	promotionalcode: Promotionalcode[];
};

export const promotionalcodeSlice = createSlice({
	name: 'promotionalcode',
	initialState: {
		promotionalcode: []
	} as promotionalcodesState,
	reducers: {
		setpromotionalcodes: (state, action: PayloadAction<Promotionalcode[]>) => {
			state.promotionalcode = action.payload;
		}
	}
});

export type promotionalcodesliceType = typeof promotionalcodeSlice;

type AppRootStateType = RootStateType<[promotionalcodesliceType]>;

const { setpromotionalcodes } = promotionalcodeSlice.actions;

export const getPromotionalcodeAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Promotionalcode[] }>(`${END_POINT}/common/promotions`);

		dispatch(setpromotionalcodes(res.data.data));
		return 'Promotionalcode get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting Promo Codes ';
		}

		return 'Error Getting Promo Codes ';
	}
};

export const updateOldPromotionalcodeAction =
	(id: string, body: Partial<Promotionalcode>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/promotions/${id}`, body, {
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

export const deletePromotionalcodeAction =
	(id: string, shopId: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/promotions/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted promotionalcode';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting Promo Codes ';
			}

			return 'Error Deleting Promo Codes ';
		}
	};

export const saveNewPromotionalcodeAction =
	(body: Partial<Promotionalcode>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/promotions`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Promotionalcode Created succesfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving Promo Codes ';
			}

			return 'Error Saving Promo Codes ';
		}
	};

export const selectPromotionalcodes = (state: AppRootStateType) => state.promotionalcode.promotionalcode;

export default promotionalcodeSlice.reducer;
