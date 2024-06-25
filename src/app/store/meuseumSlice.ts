import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Meuseum } from 'src/helpers/entities';

type meuseumState = {
	meuseum: Meuseum[];
};

export const meuseumSlice = createSlice({
	name: 'meuseum',
	initialState: {
		meuseum: []
	} as meuseumState,
	reducers: {
		setmeuseum: (state, action: PayloadAction<Meuseum[]>) => {
			state.meuseum = action.payload;
		}
	}
});

export type meuseumsliceType = typeof meuseumSlice;

type AppRootStateType = RootStateType<[meuseumsliceType]>;

const { setmeuseum } = meuseumSlice.actions;

export const getMeuseumAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Meuseum[] }>(`${END_POINT}/admin/meuseums`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setmeuseum(res.data.data));
		return 'Meuseum get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting Meuseum';
		}

		return 'Error Getting Meuseum';
	}
};

export const updateOldMeuseumAction =
	(id: string, body: Partial<Meuseum>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/meuseum/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Meuseum';
			}

			return 'Error Updating meuseum';
		}
	};

export const deleteMeuseumAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/meuseum/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted meuseum';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting Meuseum';
			}

			return 'Error Deleting meuseum';
		}
	};

export const saveNewMeuseumAction =
	(body: Partial<Meuseum>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/meuseum`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Meuseum Created succesfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving Meuseum';
			}

			return 'Error Saving meuseum';
		}
	};

export const selectMeuseum = (state: AppRootStateType) => state.meuseum.meuseum;

export default meuseumSlice.reducer;
