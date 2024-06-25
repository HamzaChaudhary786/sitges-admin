// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { AppThunk, RootStateType } from 'app/store/types';
// import axios from 'axios';
// import { END_POINT } from 'src/helpers/constants';

// export interface ImageUploadResponse {
// 	url_original_quality: string;
// 	url_low_quality: string;
// 	url_good_quality: string;
// 	public_id: string;
// }
// export enum ProductTypes {
// 	Lighting = 'Lighting',
// 	Shelving = 'Shelving',
// 	Seating = 'Seating',
// 	Tables = 'Tables',
// 	Custom = 'Custom Designs',
// 	Collaborations = 'Collaborations'
// }

// export interface ProductToSaveBody {
// 	title: string;
// 	series: string;
// 	url: string;
// 	description: string;
// 	type: ProductTypes;
// 	dimensions: string;
// 	materials: string;
// 	isActive: boolean;
// 	price?: number;
// 	backgroundImage?: string;
// }

// export interface Product {
// 	id: string;
// 	title: string;
// 	series: string;
// 	url: string;
// 	description: string;
// 	type: ProductTypes;
// 	dimensions: string;
// 	materials: string;
// 	isActive: boolean;
// 	price?: number;
// 	backgroundImage?: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// 	productImages?: ProductImage[];
// }

// export interface ProductImage {
// 	id: string;
// 	productId: string;
// 	url_original_quality: string;
// 	url_low_quality: string;
// 	url_good_quality: string;
// 	public_id: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// type ProductsState = {
// 	products: Product[];
// };

// export const productSlice = createSlice({
// 	name: 'product',
// 	initialState: {
// 		products: []
// 	} as ProductsState,
// 	reducers: {
// 		setProducts: (state, action: PayloadAction<Product[]>) => {
// 			state.products = action.payload;
// 		}
// 	}
// });

// export type productSliceType = typeof productSlice;

// type AppRootStateType = RootStateType<[productSliceType]>;

// const { setProducts } = productSlice.actions;

// export const getProductsAction = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
// 	try {
// 		const res = await axios.get<{ data: Product[] }>(`${END_POINT}/product`, {
// 			headers: {
// 				'access-token': localStorage.getItem('jwt_access_token')
// 			}
// 		});

// 		dispatch(setProducts(res.data.data));
// 	} catch (error) {
// 		console.log('error', error);
// 	}
// };

// export const deleteProductAction =
// 	(id: string): AppThunk<Promise<void>> =>
// 	async () => {
// 		try {
// 			await axios.delete(`${END_POINT}/product/${id}`, {
// 				headers: {
// 					'access-token': localStorage.getItem('jwt_access_token')
// 				}
// 			});
// 		} catch (error) {
// 			console.log('error', error);
// 		}
// 	};

// export const saveNewProductAction =
// 	(body: ProductToSaveBody): AppThunk<Promise<void>> =>
// 	async () => {
// 		try {
// 			const res = await axios.post<{ data: { id: string } }>(`${END_POINT}/product/`, body, {
// 				headers: {
// 					'access-token': localStorage.getItem('jwt_access_token')
// 				}
// 			});

// 			// return res.data.data.id;
// 		} catch (error) {
// 			console.log('error', error);
// 		}
// 	};

// export const saveNewImageInProductAction =
// 	(id: string, file: File): AppThunk<Promise<void>> =>
// 	async () => {
// 		try {
// 			const formData = new FormData();
// 			formData.append('fileToUpload', file);
// 			await axios.post(`${END_POINT}/product/image/${id}`, formData, {
// 				headers: {
// 					'access-token': localStorage.getItem('jwt_access_token')
// 				}
// 			});
// 		} catch (error) {
// 			console.log('error', error);
// 		}
// 	};

// export const uploadImageToCloudnairyAndGetLink =
// 	(file: File): AppThunk<Promise<string | void>> =>
// 	async () => {
// 		try {
// 			const formData = new FormData();
// 			formData.append('fileToUpload', file);
// 			const res = await axios.post<{ data: ImageUploadResponse }>(`${END_POINT}/common/upload-file`, formData, {
// 				headers: {
// 					'access-token': localStorage.getItem('jwt_access_token')
// 				}
// 			});

// 			return res.data.data.url_low_quality;
// 		} catch (error) {
// 			console.log('error', error);
// 		}
// 	};

// export const deleteProductImageAction =
// 	(imageId: string): AppThunk<Promise<void>> =>
// 	async () => {
// 		try {
// 			await axios.delete(`${END_POINT}/product/image/${imageId}`, {
// 				headers: {
// 					'access-token': localStorage.getItem('jwt_access_token')
// 				}
// 			});
// 		} catch (error) {
// 			console.log('error', error);
// 		}
// 	};

// export const updateOldProductAction =
// 	(id: string, body: Partial<ProductToSaveBody>): AppThunk<Promise<string | void>> =>
// 	async () => {
// 		try {
// 			const res = await axios.put(`${END_POINT}/product/${id}`, body, {
// 				headers: {
// 					'access-token': localStorage.getItem('jwt_access_token')
// 				}
// 			});
// 		} catch (error) {
// 			console.log('error', error);
// 		}
// 	};

// export const selectProducts = (state: AppRootStateType) => state.product.products;

// export default productSlice.reducer;
