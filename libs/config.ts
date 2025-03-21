export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['productBarter', 'productRent'];

const thisYear = new Date().getFullYear();

export const productYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	productYears.push(String(i));
}

export const productMaterials = ['wood', 'metal', 'plastic'];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topProductRank = 3;
