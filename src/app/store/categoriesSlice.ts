import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Category } from 'src/helpers/entities';

type CategoryState = {
	category: Category[];
};

export const categoryslice = createSlice({
	name: 'category',
	initialState: {
		category: []
	} as CategoryState,
	reducers: {
		setCategory: (state, action: PayloadAction<Category[]>) => {
			state.category = action.payload;
		}
	}
});

export type categorysliceType = typeof categoryslice;

type AppRootStateType = RootStateType<[categorysliceType]>;

export const { setCategory } = categoryslice.actions;

export const getCategoriesAction =
	(resId: string): AppThunk<Promise<string>> =>
	async (dispatch) => {
		try {
			const res = await axios.get<{ data: Category[] }>(`${END_POINT}/admin/restaurants/${resId}/categories`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			// console.log(res);

			dispatch(setCategory(res.data.data));
			return 'Category get successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Getting Categories';
			}

			return 'Error Getting Categories';
		}
	};

export const updateOldCategoryAction =
	(resId: string, catId: string, body: Partial<Category>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/restaurants/${resId}/${catId}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating category';
			}

			return 'Error Updating category';
		}
	};

export const saveNewCategoryAction =
	(resId: string, body: Partial<Category>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/restaurants/${resId}/category`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Category Added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Adding category';
			}

			return 'Error Adding category';
		}
	};

// export const deleteCategoryAction =
// 	(id: string): AppThunk<Promise<string>> =>
// 	async () => {
// 		try {
// 			await axios.delete(`${END_POINT}/category/category/${id}`, {
// 				headers: {
// 					'access-token': localStorage.getItem('jwt_access_token')
// 				}
// 			});
// 			return 'Deleted category';
// 		} catch (error) {
// 			return 'error';
// 		}
// 	};

export const selectCategory = (state: AppRootStateType) => state.category.category;

export default categoryslice.reducer;
