import React, { FC } from 'react';
import './style/index.scss';

const CityNight: FC<any> = function (props) {
	return (
		<div>
			{props.children}
		</div>
	);
};

export default CityNight;

