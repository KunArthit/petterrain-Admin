import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProductHeader from './ProductHeader';
import { useGetECommerceProductQuery } from '../../ECommerceApi';
import ProductModel from '../models/ProductModel';
import ProductCreate from './tabs/CreateProduct';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a product name').min(5, 'The product name must be at least 5 characters')
});

/**
 * The product page.
 */
function Product() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();

	const { productId } = routeParams;

	const {
		data: product,
		isLoading: isProductLoading,
		isError
	} = useGetECommerceProductQuery(productId, {
		skip: !productId || productId === 'new'
	});

	const [tabValue, setTabValue] = useState('basic-info');

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;
	const [isLoading, setIsLoading] = useState(false);

	const form = watch();

	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		} else {
			reset({ id: productId });
		}
	}, [productId, reset]);

	useEffect(() => {
		if (product) {
			reset({ ...product });
		}
	}, [product, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event: SyntheticEvent, value: string) {
		setTabValue(value);
	}

	if (isProductLoading) {
		return <FuseLoading />;
	}

	/**
	 * Wait while form is empty (optional)
	 */
	if (_.isEmpty(form)) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ProductHeader />}
				content={
					// <div className="p-16 sm:p-24 max-w-3xl space-y-24">
					// 	<FuseTabs
					// 		value={tabValue}
					// 		onChange={handleTabChange}
					// 	>
					// 		<FuseTab value="basic-info" label="Basic Info" />
					// 		<FuseTab value="add-images" label="Add Images" />
					// 		<FuseTab value="add-videos" label="Add Videos" />
					// 		<FuseTab value="pricing" label="Pricing" />
					// 		<FuseTab value="status" label="Settings" />
					// 	</FuseTabs>

					// 	<div className="">

					// 		<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
					// 			<BasicInfoTab />
					// 		</div>

					// 		<div className={tabValue !== 'add-images' ? 'hidden' : ''}>
					// 			<ImagesTab />
					// 		</div>
					// 		<div className={tabValue !== 'add-images' ? 'hidden' : ''}>
					// 			<VideosTab />
					// 		</div>

					// 		<div className={tabValue !== 'pricing' ? 'hidden' : ''}>
					// 			<PricingTab />
					// 		</div>
					// 		<div className={tabValue !== 'pricing' ? 'hidden' : ''}>
					// 			<StatusTab />
					// 		</div>

					// 	</div>
					// </div>
					<ProductCreate />
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Product;
