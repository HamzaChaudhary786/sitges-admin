import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Restaurants } from 'src/helpers/entities';

type RestaurantsState = {
	restaurant: Restaurants[];
};

export const restaurantSlice = createSlice({
	name: 'restaurant',
	initialState: {
		restaurant: []
	} as RestaurantsState,
	reducers: {
		setRestaurant: (state, action: PayloadAction<Restaurants[]>) => {
			state.restaurant = action.payload;
		}
	}
});

export type restaurantSliceType = typeof restaurantSlice;

type AppRootStateType = RootStateType<[restaurantSliceType]>;

const { setRestaurant } = restaurantSlice.actions;

export const getRestaurantUsersAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Restaurants[] }>(`${END_POINT}/admin/shops`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setRestaurant(res.data.data));
		return 'Restaurants get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting Restaurant';
		}

		return 'Error Getting Restaurant';
	}
};

export const saveNewRestaurantAction =
	(body: Partial<Restaurants>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/shops`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Restaurants added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving Restaurant';
			}

			return 'Error Saving Restaurant';
		}
	};

export const uploadImageToAWSAndGetLink =
	(file: File): AppThunk<Promise<string | void>> =>
	async () => {
		try {
			const formData = new FormData();
			formData.append('fileToUpload', file);
			const res = await axios.post<{ data: string }>(`${END_POINT}/common/upload-file`, formData, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});

			// console.log('-----------', res.data.data);
			if (!res.data.data) return 'Error Uploading Image';

			return res.data.data;
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Uploading Image';
			}

			return 'Error Uploading Image';
		}
	};

export const updateOldRestaurantAction =
	(id: string, body: Partial<Restaurants>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/shops/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Restaurant';
			}

			return 'Error Updating Restaurant';
		}
	};

export const selectRestaurants = (state: AppRootStateType) => state.restaurant.restaurant;

export default restaurantSlice.reducer;
