export interface Riders {
	id: string;
	userId: string;
	email: string;
	phoneNo: string;
	profileImage?: string | File;

	idCard?: string[];
	vehicleCC?: string;
	vehiclePlateNo?: string;
	circulationPermit?: string | File;
	certificate?: string | File;

	vehicleInsurance?: string | File;
	drivingLiscence?: string[];
	circulationValidDate?: string;
	certificateValidDate?: string;
	insuranceValidDate?: string;
	idNumber: string;
	firstName: string;
	lastName: string;
	countryCode: string;
	nationality: string;
	city: string;
	status: ProfileStatus;
	preferedLanguage: Languages;
	registerdAs: RiderRegisterType;
	license: DrivingLicense;
	vehicle: DriversOwnVehicle;
	vehicleType?: VehicleType;
	availability?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Enterprises {
	id: string;
	name: string;
	enterpriseId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Promotionalcode {
	id: string;
	name?: string;
	shopId: string;
	code: string;
	discountPercentage: number;
	image: string;
	status: PromotionSlidersStatus;
	createdById: string;
	createdAt: string;
	updatedAt: string;
}

export enum PromotionSlidersStatus {
	AwaitingApproval = 'AwaitingApproval',
	Blocked = 'Blocked',
	Expired = 'Expired',
	Active = 'Active'
}

export interface ProductTopping {
	id: string;
	toppingName: string;
	price: number;
	productId: string;
	createdAt: string;
	updatedAt: string;
}

export enum DeliveryService {
	PickUpOnly = 'PickUpOnly',
	HomeOnly = 'HomeOnly',
	OnlyInMesa = 'OnlyInMesa',
	PickUpAndDelivery = 'PickUpAndDelivery',
	AtTableAndHome = 'AtTableAndHome',
	OnTableToPickUpAndHome = 'OnTableToPickUpAndHome'
}

export enum VatApplied {
	General = '(ES) General (21%)',
	Reduced = '(ES)Reduced (10%)'
}

export enum ActiveBlockStatus {
	Active = 'Active',
	Blocked = 'Blocked'
}

export interface Product {
	id: string;
	categoryId: string;
	name: string;
	price: number;
	status: ActiveBlockStatus;
	image: string;
	displayMode: DisplayMode;
	allergies?: string[];
	shortDescription?: string;
	minimumPreparationTime: number;
	variation?: ProductVariation[];
	toppings?: ProductTopping[];
	createdAt: string;
	updatedAt: string;
}

export interface ProductVariation {
	id: string;
	variationName: string;
	price: number;
	createdAt: string;
	updatedAt: string;
}

export enum IdealFor {
	Families = 'Families',
	PlayingBeachGame = 'PlayingBeachGame',
	Couples = 'Couples',
	'Gay/LGBTQ' = 'Gay/LGBTQ',
	Relaxing = 'Relaxing',
	Reading = 'Reading',
	Nudist = 'Nudist'
}

export enum DisplayMode {
	ListModeView = 'ListModeView',
	ThumbnailModeView = 'ThumbnailModeView'
}

export enum SoldBy {
	No = 'No',
	Yes = 'Yes'
}

export enum CategoryStatus {
	InActive = 'InActive',
	Active = 'Active'
}

export enum ShopTypes {
	Restaurant = 'Restaurant',
	Shop = 'Shop',
	Beach = 'Beach',
	Meuseum = 'Meuseum',
	Events = 'Events'
}

export interface Category {
	id: string;
	name: string;
	image: string;
	description?: string;
	shopId: string;
	displayMode: DisplayMode;
	soldBy: SoldBy;
	categoryStatus: CategoryStatus;
	createdAt: string;
	updatedAt: string;
}

export interface Tourism {
	id: string;
	name: string;
	images: string[];
	description?: string;
	importantInformation?: string;
	IdealFor?: IdealFor[];
	style?: MeuseumStyles[];
	lat: number;
	long: number;
	eventCategoryName?: EventCategories;
	averageRating: number;
	features?: Features[];
	productTags?: string[];
	promotionalTags?: string[];
	type: TourismTypes;
	price?: string;
	openTime?: string;
	organizer?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Meuseum {
	specialitiesTags: any;
	id: string;
	name: string;
	profileImage?: string | File;
	coverImage?: string | File;
	shortBio?: string;
	specialities?: string[];
	meuseumTags?: string;
	description?: string;
	styles: MeuseumStyles[];
	importantInformation?: string;
	idealFor: IdealFor[];
	type: TourismTypes;
	averageRating?: number;
	lat: number;
	long: number;
	features: Features[];
	promotionalTag?: string;
	productTags: string[];
	price: string;
	openTime: string;
	status: ShopStatus;
	meuseumDetails: Partial<MeuseumDetails>;
}

export interface Beach {
	importantInformation?: string;
	description?: string;
	safe?: string;
	shortDescription?: string;
	danger?: string;
	caution?: string;
	idealFor?: any;
	features?: any;
	approveStatus?: string;
	id: string;
	name: string;
	profileImage?: string | File;
	coverImage?: string | File;
	status?: string;
	averageRating: number;
	type: TourismTypes;
	lat: number;
	long: number;
	beachDetails?: Partial<BeachDetails>;

}

export interface Event {
	id: string;
	name: string;
	profileImage?: string | File;
	coverImage?: string | File;
	shortBio?: string;
	description?: string;
	Type?: string;
	eventTags?: string;
	importantInformation?: string;
	idealFor: IdealFor[];
	lat: number;
	long: number;
	status: ShopStatus;
	averageRating: number;
	eventCategoryName: EventCategories;
	productTag?: string[];
	promotionalTag?: string;
	type: TourismTypes;
	startingPrice?: string;
	openTime: string;
	organizer: string;
	meuseumId: string;
	createdAt: string;
	updatedAt: string;
}

export enum TourismTypes {
	Beach = 'Beach',
	Meuseum = 'Meuseum',
	Events = 'Events'
}

export enum Features {
	LifeGuard = 'LifeGuard',
	BeachAndWaterActivities = 'BeachAndWaterActivities',
	Chiringuito = 'Chiringuito',
	BackgroundMusic = 'BackgroundMusic',
	SunBedsAndShadeRentals = 'SunBedsAndShadeRentals',
	PadelBoat = 'PadelBoat',
	VolleyBallBeachCourt = 'VolleyBallBeachCourt'
}

export enum EventCategories {
	Culture = 'Culture',
	Sports = 'Sports',
	Leisure = 'Leisure'
}

export enum MeuseumStyles {
	ModernistArt = 'Modernist Art',
	ContemporaryArtMuseum = 'Contemporary Art Museum',
	SpecializedMuseum = 'Specialized Museum',
	HistoryMuseum = 'History Museum',
	RomanticMuseum = 'Romantic Museum',
	NeoclassicalMuseum = 'Neoclassical Museum',
	MixedMuseum = 'Mixed Museum',
}

export enum RiderRegisterType {
	Independent = 'Independent',
	NotIndependent = 'NotIndependent'
}

export enum DrivingLicense {
	Yes = 'Yes',
	No = 'No'
}

export enum DriversOwnVehicle {
	Yes = 'Yes',
	No = 'No'
}

export enum VehicleType {
	'50cc-moped' = '50cc-moped',
	Motorcycle = 'Motorcycle',
	Bike = 'No'
}

export interface UpdateRiderUsers {
	firstName?: string;
	lastName?: string;
	email?: string;
	vehicleCC?: string;
	vehiclePlateNo?: string;
	nationality?: string;
	idNumber?: string;
	idCard?: string[];
	phoneNumber?: string;
	profileImage?: string | File;
	drivingLiscence?: string[];
	certificate?: string | File;
	certificateValidDate?: string;
	insuranceValidDate?: string;
	circulationValidDate?: string;
	circulationPermit?: string | File;
	vehicleInsurance?: string | File;
	countryCode?: string;
	country?: string;
	city?: string;
	preferedLanguage?: Languages;
	registerdAs?: RiderRegisterType;
	license?: DrivingLicense;
	vehicle?: DriversOwnVehicle;
	vehicleType?: VehicleType;
	availability?: string;
	status: ProfileStatus;
}

export enum Languages {
	English = 'English',
	Spanish = 'Español'
}

export enum ProfileStatus {
	Approved = 'Approved',
	AwaitingApproval = 'AwaitingApproval',
	Rejected = 'Rejected',
	Blocked = 'Blocked'
}


export enum ShopStatus {
	Active = 'Active',
	InActive = 'InActive'
}

export interface ImageUploadResponse {
	url_original_quality: string;
	url_low_quality: string;
	url_good_quality: string;
	public_id: string;
}

export interface AdminUsers {
	name: string;
	email: string;
	password: string;
	status: string;
}

export interface UpdateAdminUsers {
	name: string;
	email: string;
	status: string;
}

export interface Admin {
	id: string;
	name: string;
	email: string;
	status: string;
}

export enum UserTypes {
	Customer = 'Customer',
	Vendor = 'Vendor',
	Admin = 'Admin',
	Dispatcher = 'Dispatcher',
	Rider = 'Rider'
}

export enum UserStatus {
	Active = 'Active',
	Inactive = 'Inactive',
	Blocked = 'Blocked',
	Deleted = 'Deleted',
	Pending = 'Pending'
}

export interface Customers {
	id: string;
	masterId: string;
	enterpriseId: string;
	userSystemId: string;
	password?: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNo: string;
	countryCode: string;
	isPreLaunchUser: boolean;
	referralCode?: string;
	birthday?: string;
	nationality?: string;
	livesInSitges?: boolean;
	visitFromDate?: string;
	visitToDate?: string;
	visitReason?: string;
	visitStayType?: string;
	visitWith?: string;
	bio?: string;
	isBasicUserProfileCompleted: boolean;
	types: UserTypes[];
	status: UserStatus;
}

export interface Dispatchers {
	id: string;
	name: string;
	email: string;
	password: string;
	phone: string;
	status: UserStatus;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateDispatcherUsers {
	name: string;
	email: string;
	phone: string;
	status: UserStatus;
}

export enum RestaurantTypes {
	// Restaurant = 'Restaurant',
	Restaurant = 'Restaurant',
	Beach = 'Beach',
	Meuseum = 'Meuseum',
	Events = 'Events'
}

export interface Restaurants {
	id: string;
	name: string;
	productTags?: string;
	promotionalTags?: string;
	types: RestaurantTypes;
	coverImage: string;
	profileImage: string;
	status: boolean;
	approveStatus: ProfileStatus;
	deliveryTime: string;
	deliveryAmount: number;
	averageRating?: number;
	lat: number;
	long: number;
	vendorId: string;
	shopDetails?: Partial<RestaurantDetails>;
	email?: string;
	createdAt: string;
	updatedAt: string;
}

export interface RestaurantDetails {
	id: string;
	restaurantId: string;
	email: string;
	acceptCoupons: boolean;
	freeShipping: boolean;
	onlinePayment: boolean;
	cardPayment: boolean;
	address: string;
	effectivePayment: boolean;
	isVegan: boolean;
	isVegetarian: boolean;
	generalInformation?: string;
	attributes?: string;
	idealFor: string[];
	bussinessName: string;
	companyName: string;
	nifCifId: string;

	termsOfUse: string;
	privacyPolicy: string;
	deliveryAndReturnPolicy: string;

	commercialCode: number;
	businessTelephone: string;
	isBusinessTelephoneOnWhatsapp: boolean;
	telephoneOperations: string;
	isTelephoneOperationsOnWhatsapp: boolean;
	escalationPhone: string;
	isEscalationPhoneOnWhatsapp: boolean;
	nameOfTheRoad: string;
	trackNumber: number;
	postalCode: number;
	area: string;
	country: string;
	specialities: string[];
	features: string[];
	comments?: string;

	createdAt: string;
	updatedAt: string;
}

export interface BeachDetails {
	description?: string;
	importantInformation?: string;
	idealFor: IdealFor[];
	features: Features[];
	caution: string;
	safe: string;
	danger: string;
}
export interface MeuseumDetails {
	description?: string;
	idealFor: IdealFor[];
	features: Features[];
	specialities?: string[];
	styles?: string[]
}

export enum CodeStatus {
	Active = 'Active',
	Blocked = 'Blocked'
}

export interface Promocode {
	id: string;
	name: string;
	code: string;
	shopId: string;
	discount: number;
	status: CodeStatus;
	createdAt: string;
	updatedAt: string;
}

export interface Vendors {
	id: string;
	firstName: string;
	lastName: string;
	emailAccounting?: string;
	phoneNo?: string;
	postCode?: string;
	fiscalAddress?: string;
	countryCode?: string;
	commercialName?: string;
	block?: string;
	town?: string;
	street?: string;
	stair?: string;
	floor?: string;
	door?: string;
	userId: string;
	companyName: string;
	commercialActivity?: string;
	profileImage?: string | File;
	nifNumber: string;
	additionalAddress?: string;
	category: VendorCategory;
	commercialInvoice: boolean;
	status: ProfileStatus;
	ownerFirstName: string;
	ownerLastName: string;
	ownerPhoneNo: string;
	registeredAs: VendorRegisterType;
	preferedLanguage: Languages;
	dispatcher?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateVendorUsers {
	userId?: string;
	companyName?: string;
	commercialName?: string;
	block?: string;
	fiscalAddress?: string;
	phoneNo?: string;
	town?: string;
	profileImage?: string | File;
	stair?: string;
	floor?: string;
	door?: string;
	postCode?: string;
	street?: string;
	countryCode?: string;
	emailAccounting?: string;
	nifNumber?: string;
	additionalAddress?: string;
	commercialActivity?: string;
	category?: VendorCategory;
	commercialInvoice?: boolean;
	status?: ProfileStatus;
	ownerFirstName?: string;
	ownerLastName?: string;
	ownerPhoneNo?: string;
	registeredAs?: VendorRegisterType;
	preferedLanguage?: Languages;
	dispatcher?: string | null;
}

export enum VendorCategory {
	Services = 'Services',
	Products = 'Products',
	Restoration = 'Restoration',
	Rental = 'Rental'
}

export enum VendorRegisterType {
	'Self-employed' = 'Self-employed',
	Society = 'Society',
	Others = 'Others'
}
