import { ProductLocation, ProductStatus, ProductType } from '../../enums/product.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Product {
	_id: string;
	productType: ProductType;
	productStatus: ProductStatus;
	productLocation: ProductLocation;
	productAddress: string;
	productTitle: string;
	productPrice: number;
	productMaterials: string;
	productColors: string;
	productViews: number;
	productLikes: number;
	productComments: number;
	productRank: number;
	productImages: string[];
	productDesc?: string;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Product {
	list: Product[];
	metaCounter: TotalCounter[];
}
