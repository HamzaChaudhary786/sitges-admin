import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Customers } from 'src/helpers/entities';

type CustomersState = {
	customer: Customers[];
};

interface RegisterResponseData {
	data: {
		accessToken: string;
		refreshToken: string;
	};
}

export const customerSlice = createSlice({
	name: 'customer',
	initialState: {
		customer: []
	} as CustomersState,
	reducers: {
		setCustomer: (state, action: PayloadAction<Customers[]>) => {
			state.customer = action.payload;
		}
	}
});

export type customerSliceType = typeof customerSlice;

type AppRootStateType = RootStateType<[customerSliceType]>;

const { setCustomer } = customerSlice.actions;

export const getCustomersAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Customers[] }>(`${END_POINT}/admin/users`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setCustomer(res.data.data));
		return 'Customers get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting enterprise User';
		}

		return 'Error Getting enterprise User';
	}
};

export const updateOldCustomerAction =
	(id: string, body: Partial<Customers>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/customer/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating dispatcher';
			}

			return 'Error Updating Customer';
		}
	};

export const saveNewCustomerAction =
	(body: Partial<Customers>): AppThunk<Promise<string>> =>
	async () => {
		try {
			let { referralCode } = body;
			const { email, password, phoneNo, countryCode, ...userInfo } = body;

			if (!referralCode) referralCode = null;

			const response: AxiosResponse<RegisterResponseData> = await axios.post(
				`${END_POINT}/auth/register`,
				{ email, password, phoneNo, referralCode, countryCode },
				{}
			);

			const { accessToken } = response.data.data;

			if (!accessToken) return 'Unable to create Customer';

			const { firstName, lastName, birthday, nationality, livesInSitges, bio, ...visitInfo } = userInfo;

			const userInformation = await axios.post(
				`${END_POINT}/user/info`,
				{ firstName, lastName, birthday, nationality, livesInSitges, bio },
				{
					headers: {
						'access-token': accessToken
					}
				}
			);

			if (!userInformation) return 'Unable to add user Info';

			if (livesInSitges) {
				const visitInformation = await axios.post(`${END_POINT}/user/visit`, visitInfo, {
					headers: {
						'access-token': accessToken
					}
				});

				if (!visitInformation) return 'Unable to add user Visit Info';
			}

			return 'User Added successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Adding Customer';
			}

			return 'Error Adding Customer';
		}
	};

export const selectCustomers = (state: AppRootStateType) => state.customer.customer;

export default customerSlice.reducer;
