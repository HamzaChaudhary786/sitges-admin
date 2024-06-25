import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Product, ProductVariation } from 'src/helpers/entities';

type ProductState = {
	product: Product[];
};

export const productslice = createSlice({
	name: 'product',
	initialState: {
		product: []
	} as ProductState,
	reducers: {
		setProduct: (state, action: PayloadAction<Product[]>) => {
			state.product = action.payload;
		}
	}
});

export type productsliceType = typeof productslice;

type AppRootStateType = RootStateType<[productsliceType]>;

export const { setProduct } = productslice.actions;

export const getProductsAction =
	(resId: string, catId: string): AppThunk<Promise<string>> =>
	async (dispatch) => {
		try {
			const res = await axios.get<{ data: Product[] }>(
				`${END_POINT}/admin/restaurants/${resId}/categories/${catId}/products`,
				{
					headers: {
						'access-token': localStorage.getItem('jwt_access_token')
					}
				}
			);
			// console.log(res);

			dispatch(setProduct(res.data.data));
			return 'Product get successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Getting Products';
			}

			return 'Error Getting Products';
		}
	};

export const updateOldProductAction =
	(resId: string, catId: string, pId: string, body: Partial<Product>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/restaurants/${resId}/category/${catId}/product/${pId}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Products';
			}

			return 'Error Updating Products';
		}
	};

export const updateOldProductVariationAction =
	(productVariationId: string, body: Partial<ProductVariation>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/product-variation/${productVariationId}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Product Variation';
			}

			return 'Error Updating Product Variation';
		}
	};

export const saveNewProductAction =
	(resId: string, catId: string, body: Partial<Product>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/restaurants/${resId}/category/${catId}/product`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Product Added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving New Product ';
			}

			return 'Error Saving New Product ';
		}
	};

export const saveNewProductVariationAction =
	(pId: string, body: Partial<Product>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/product-variation/${pId}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Product Variation Added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving New Product Variation';
			}

			return 'Error Saving New Product Variation';
		}
	};

export const saveNewProductToppingAction =
	(pId: string, body: Partial<Product>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/product-toppings/${pId}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Product Toppings Added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving New Product Variation';
			}

			return 'Error Saving New Product Variation';
		}
	};

export const updateOldProductToppingAction =
	(productVariationId: string, body: Partial<ProductVariation>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/product-toppings/${productVariationId}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Product Variation';
			}

			return 'Error Updating Product Variation';
		}
	};

export const deleteProductToppingAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/product-toppings/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted product toppings';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting product Variation';
			}

			return 'Error Deleting product Variation';
		}
	};

export const connectDipatcherToVendor =
	(id: string, body: Partial<{ productId: string }>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/vendor/${id}/new-product`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Product Connected successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Connecting product';
			}

			return 'Error Connecting product';
		}
	};

export const deleteProductVariationAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/product-variation/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted product Variation';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting product Variation';
			}

			return 'Error Deleting product Variation';
		}
	};

export const selectProduct = (state: AppRootStateType) => state.product.product;

export default productslice.reducer;
