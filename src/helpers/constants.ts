import { RestaurantTypes } from './entities';

export const END_POINT = import.meta.env.VITE_API_ENDPOINT;

export const manualDeploy = 'v_1';
export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registeredAsMenuItems = [
	{ label: 'Self-employed', value: 'Self-employed' },
	{ label: 'Society', value: 'Society' },
	{ label: 'Others', value: 'Others' }
];
export const StatusValue = [
	{ label: 'true', value: true },
	{ label: 'false', value: false }
]

export const RestaurantIdeal = [
	{ value: 'Families', label: 'Families' },
	{ value: 'Couples', label: 'Couples' },
	{ value: 'Kids', label: 'Kids' }
];

export const ShopFeatures = [
	{ value: 'Terrace', label: 'Terrace' },
	{ value: 'Sea View', label: 'Sea View' },
	{ value: 'Lounge Area', label: 'Lounge Area' },
	{ value: 'Inside Dinning', label: 'Inside Dinning' },
	{ value: 'Air Conditioning', label: 'Air Conditioning' },
	{ value: 'Accessibility', label: 'Accessibility' },
	{ value: 'Toilets', label: 'Toilets' },
	{ value: 'Breakfast', label: 'Breakfast' },
	{ value: 'Daily Menu', label: 'Daily Menu' },
	{ value: 'Cocktails', label: 'Cocktails' }
];

export const allergens = [
	{ value: 'GLUTEN', label: 'Gluten' },
	{ value: 'SOJA', label: 'Soja' },
	{ value: 'CRUSTACEOS', label: 'Crustáceos' },
	{ value: 'MOSTAZA', label: 'Mostaza' },
	{ value: 'CACAHUETES', label: 'Cacahuetes' },
	{ value: 'LACTEOS', label: 'Lácteos' },
	{ value: 'SULFU', label: 'Sulfitos' },
	{ value: 'ANHID', label: 'Anhídrido sulfuroso y sulfitos' },
	{ value: 'PESCADO', label: 'Pescado' },
	{ value: 'HUEVOS', label: 'Huevos' },
	{ value: 'SÉSAMO', label: 'Sésamo' },
	{ value: 'MOLUSCOS', label: 'Moluscos' },
	{ value: 'ALTRAMUCES', label: 'Altramuces' }
];

export const TourismIdealFor = [
	{ value: 'Families', label: 'Families' },
	{ value: 'PlayingBeachGame', label: 'PlayingBeachGame' },
	{ value: 'Couples', label: 'Couples' },
	{ value: 'Relaxing', label: 'Relaxing' },
	{ value: 'Reading', label: 'Reading' }
];

export const TourismFeatures = [
	{ value: 'LifeGuard', label: 'LifeGuard' },
	{ value: 'BeachAndWaterActivities', label: 'BeachAndWaterActivities' },
	{ value: 'Chiringuito', label: 'Chiringuito' },
	{ value: 'BackgroundMusic', label: 'BackgroundMusic' },
	{ value: 'SunBedsAndShadeRentals', label: 'SunBedsAndShadeRentals' },
	{ value: 'PadelBoat', label: 'PadelBoat' },
	{ value: 'VolleyBallBeachCourt', label: 'VolleyBallBeachCourt' }

];

export const BeachFeatures = [
	{ value: 'UmbrellaRental', label: 'Umbrella Rental' },
	{ value: 'SeaConditions', label: 'Sea Conditions' },
	{ value: 'HammockRental', label: 'Hammock Rental' },
	{ value: 'SeaPedals', label: 'Sea Pedals' },
	{ value: 'Ramp', label: 'Ramp' },
	{ value: 'VolleyballNets', label: 'Volleyball Nets' },
	{ value: 'Bathrooms', label: 'Bathrooms' },
	{ value: 'Showers', label: 'Showers' },
	{ value: 'LifeGuard', label: 'Life Guard' },
	{ value: 'BeachBar', label: 'Beach Bar' }
];

export const MeuseumStyle = [
	{ value: 'ModernistArt', label: 'ModernistArt' },
	{ value: 'ContemporaryArtMuseum', label: 'ContemporaryArtMuseum' },
	{ value: 'SpecializedMuseum', label: 'SpecializedMuseum' },
	{ value: 'HistoryMuseum', label: 'HistoryMuseum ' },
	{ value: 'RomanticMuseum', label: ' RomanticMuseum' },
	{ value: 'NeoclassicalMuseum', label: 'NeoclassicalMuseum' },
	{ value: 'MixedMuseum', label: '  MixedMuseum ' }
];


export const TourismType = [
	{ value: 'Beach', label: 'Beach' },
	{ value: 'Meuseum', label: 'Meuseum' },
	{ value: 'Events', label: 'Events' }
];

export const vehicleMenuItems = [
	{ label: 'Yes', value: 'Yes' },
	{ label: 'No', value: 'No' }
];

export const StatusItems = [
	{ label: 'Approved', value: 'Approved' },
	{ label: 'AwaitingApproval', value: 'AwaitingApproval' },
	{ label: 'Rejected', value: 'Rejected' },
	{ label: 'Blocked', value: 'Blocked' }
];

export const YesNoMenuItems = [
	{ value: true, label: 'Yes' },
	{ value: false, label: 'No' }
];

export const ItemsYesNo = [
	{ value: 'Yes', label: 'Yes' },
	{ value: 'No', label: 'No' }
];
export const CountryCode = [
	{ value: '+92', label: '+92' },
	{ value: '+93', label: '+93' },
	{ value: '+94', label: '+94' }
];

export const ShopStatusItems = [
	{ value: 'Active', label: 'Active' },
	{ value: 'InActive', label: 'InActive' }
];

export const EventCategoriesItems = [
	{ value: 'Sports', label: 'Sports' },
	{ value: 'Culture', label: 'Culture' },
	{ value: 'Leisure', label: 'Leisure' }
];

export const CodeStatusItems = [
	{ value: 'Active', label: 'Active' },
	{ value: 'Blocked', label: 'Blocked' }
];

export const PromotionSlidersStatusItems = [
	{ value: 'AwaitingApproval', label: 'Awaiting Approval' },
	{ value: 'Blocked', label: 'Blocked' },
	{ value: 'Expired', label: 'Expired' },
	{ value: 'Active', label: 'Active' }
];

export const CategoryVendor = [
	{ value: 'Services', label: 'Services' },
	{ value: 'Products', label: 'Products' }
];

export const TourismTypes = [
	{ value: 'Beach', label: 'Beach' },
	{ value: 'Meuseum', label: 'Meuseum' },
	{ value: 'Events', label: 'Events' }
];

export const IndependenceMenuItems = [
	{ value: 'Independent', label: 'Independent' },
	{ value: 'NotIndependent', label: 'Not Independent' }
];

export const UserStatusMenuItems = [
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'InActive' },
	{ value: 'Pending', label: 'Pending' },
	{ value: 'Blocked', label: 'Blocked' },
	{ value: 'Deleted', label: 'Deleted' }
];

export const CategoryStatusMenuItems = [
	{ value: 'InActive', label: 'InActive' },
	{ value: 'Active', label: 'Active' }
];

export const DisplayModeMenuItems = [
	{ value: 'ListModeView', label: 'ListModeView' },
	{ value: 'ThumbnailModeView', label: 'ThumbnailModeView' }
];

export const VehicleTypeMenuItems = [
	{ value: 'Electric Scooter', label: 'Electric Scooter' },
	{ value: 'Bicycle', label: 'Bicycle' },
	{ value: 'Bike', label: 'Bike' },
	{ value: 'Car', label: 'Car' }
];
export const VehicleCCMenuItems = [
	{ value: '50cc', label: '50cc' },
	{ value: '125cc', label: '125cc' },
	{ value: '600cc', label: '600cc' },
	{ value: '1000cc', label: '1000cc' }
];
export const LanguageMenuItems = [
	{ value: 'English', label: 'English' },
	{ value: 'Spanish', label: 'Spanish' }
];

export const RestaurantTypeMenuItems = [
	{ value: RestaurantTypes.Restaurant, label: 'Restaurant' },
	{ value: RestaurantTypes.Beach, label: 'Beach' },
	{ value: RestaurantTypes.Meuseum, label: 'Meuseum' },
	{ value: RestaurantTypes.Events, label: 'Events' }
];
