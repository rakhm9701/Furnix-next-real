import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/logo-A.jpg" />

				{/* SEO */}
				<meta name="keyword" content={'furnix, furnix.uz, devex mern, mern nestjs fullstack'} />
				<meta
					name={'description'}
					content={
						'Buy and sell products anywhere anytime in the USA. Best Products at Best prices on furnix.uz | ' +
						'Покупайте и продавайте товары где угодно и когда угодно в США. Лучшие товары по лучшим ценам на furnix.uz | ' +
						'미국 어디에서나 언제든지 제품을 사고 팔 수 있습니다. furnix.uz에서 최고의 가격으로 최고의 제품을 구매하세요'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
