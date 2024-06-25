export function DateFormat(time: string): string {
	const date = new Date(time);

	const day = date.getDate();
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	const formattedDate = `${day} ${month} ${year} (${hours}:${minutes})`;
	return formattedDate;
}
