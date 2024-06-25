import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootStateType } from 'app/store/types';
import axios, { AxiosError } from 'axios';
import { END_POINT } from 'src/helpers/constants';
import { Event } from 'src/helpers/entities';

type eventState = {
	event: Event[];
};

export const eventSlice = createSlice({
	name: 'event',
	initialState: {
		event: []
	} as eventState,
	reducers: {
		setevent: (state, action: PayloadAction<Event[]>) => {
			state.event = action.payload;
		}
	}
});

export type eventsliceType = typeof eventSlice;

type AppRootStateType = RootStateType<[eventsliceType]>;

const { setevent } = eventSlice.actions;

export const getEventAction = (): AppThunk<Promise<string>> => async (dispatch) => {
	try {
		const res = await axios.get<{ data: Event[] }>(`${END_POINT}/admin/events`, {
			headers: {
				'access-token': localStorage.getItem('jwt_access_token')
			}
		});

		dispatch(setevent(res.data.data));
		return 'Event get successfully';
	} catch (error) {
		if (error && (error as AxiosError).response) {
			return (error.response.data.error as string) || 'Error Getting Event';
		}

		return 'Error Getting Event';
	}
};

export const updateOldEventAction =
	(id: string, body: Partial<Event>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.put(`${END_POINT}/admin/events/${id}`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Updated successfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Updating Event';
			}

			return 'Error Updating Event';
		}
	};

export const deleteEventAction =
	(id: string): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.delete(`${END_POINT}/admin/event/${id}`, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Deleted event';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Deleting Event';
			}

			return 'Error Deleting Event';
		}
	};

export const saveNewEventAction =
	(body: Partial<Event>): AppThunk<Promise<string>> =>
	async () => {
		try {
			await axios.post(`${END_POINT}/admin/events`, body, {
				headers: {
					'access-token': localStorage.getItem('jwt_access_token')
				}
			});
			return 'Event Created succesfully';
		} catch (error) {
			if (error && (error as AxiosError).response) {
				return (error.response.data.error as string) || 'Error Saving Event';
			}

			return 'Error Saving Event';
		}
	};

export const selectEvent = (state: AppRootStateType) => state.event.event;

export default eventSlice.reducer;
