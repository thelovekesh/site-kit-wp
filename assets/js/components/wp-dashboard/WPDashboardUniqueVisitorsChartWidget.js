/**
 * WPDashboardUniqueVisitorsWidget component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import {
	MODULES_ANALYTICS,
	DATE_RANGE_OFFSET as DATE_RANGE_OFFSET_ANALYTICS,
} from '../../modules/analytics/datastore/constants';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { CORE_MODULES } from '../../googlesitekit/modules/datastore/constants';
import { extractAnalyticsDashboardData } from '../../modules/analytics/util';
import WidgetReportError from '../../googlesitekit/widgets/components/WidgetReportError';
import GoogleChart from '../GoogleChart';
const { useSelect, useInViewSelect } = Data;

const WPDashboardUniqueVisitorsChartWidget = () => {
	const analyticsModule = useSelect( ( select ) =>
		select( CORE_MODULES ).getModule( 'analytics' )
	);
	const analyticsModuleActive = analyticsModule?.active;
	const analyticsModuleConnected = analyticsModule?.connected;
	const analyticsModuleActiveAndConnected =
		analyticsModuleActive && analyticsModuleConnected;

	const isGatheringData = useInViewSelect( ( select ) =>
		select( MODULES_ANALYTICS ).isGatheringData()
	);

	const { startDate, endDate, compareStartDate, compareEndDate } = useSelect(
		( select ) =>
			select( CORE_USER ).getDateRangeDates( {
				compare: true,
				offsetDays: DATE_RANGE_OFFSET_ANALYTICS,
			} )
	);

	const dateRangeLength = useSelect( ( select ) =>
		select( CORE_USER ).getDateRangeNumberOfDays()
	);

	const reportArgs = {
		startDate,
		endDate,
		compareStartDate,
		compareEndDate,
		metrics: [
			{
				expression: 'ga:users',
				alias: 'Total Users',
			},
		],
		dimensions: [ 'ga:date' ],
	};

	const data = useInViewSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getReport( reportArgs )
	);

	const loading = useSelect(
		( select ) =>
			! select( MODULES_ANALYTICS ).hasFinishedResolution( 'getReport', [
				reportArgs,
			] )
	);

	const error = useSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getErrorForSelector( 'getReport', [
			reportArgs,
		] )
	);

	if ( ! analyticsModuleActiveAndConnected ) {
		return null;
	}

	if ( error ) {
		return (
			<div className="googlesitekit-unique-visitors-chart-widget">
				<h3>Unique Visitors from Search</h3>
				<WidgetReportError moduleSlug="analytics" error={ error } />
			</div>
		);
	}

	const googleChartData =
		extractAnalyticsDashboardData(
			data || [],
			0,
			dateRangeLength,
			0,
			1,
			[ __( 'Unique Visitors', 'google-site-kit' ) ],
			[ ( x ) => parseFloat( x ).toLocaleString() ]
		) || [];

	const dates = googleChartData.slice( 1 ).map( ( [ date ] ) => date );
	const options = {
		...WPDashboardUniqueVisitorsChartWidget.chartOptions,
		hAxis: {
			...WPDashboardUniqueVisitorsChartWidget.chartOptions.hAxis,
			ticks: dates,
		},
		vAxis: {
			...WPDashboardUniqueVisitorsChartWidget.chartOptions.vAxis,
		},
		series: {
			0: {
				color: WPDashboardUniqueVisitorsChartWidget.statsColor,
				targetAxisIndex: 0,
			},
			1: {
				color: WPDashboardUniqueVisitorsChartWidget.statsColor,
				targetAxisIndex: 0,
				lineDashStyle: [ 3, 3 ],
				lineWidth: 1,
			},
		},
	};

	const currentValueIndex = 2;
	const previousValueIndex = 3;
	const isZeroChart = ! googleChartData
		.slice( 1 )
		.some(
			( datum ) =>
				datum[ currentValueIndex ] > 0 ||
				datum[ previousValueIndex ] > 0
		);

	if ( isZeroChart ) {
		options.vAxis.viewWindow.max = 100;
		options.hAxis.ticks = [ new Date() ];
	} else {
		options.vAxis.viewWindow.max = undefined;
	}

	return (
		<div className="googlesitekit-unique-visitors-chart-widget">
			<h3>Unique Visitors from Search</h3>
			<GoogleChart
				chartType="LineChart"
				data={ googleChartData }
				loadingHeight="270px"
				loadingWidth="100%"
				loaded={ ! ( loading || isGatheringData === undefined ) }
				options={ options }
				gatheringData={ isGatheringData }
			/>
		</div>
	);
};

WPDashboardUniqueVisitorsChartWidget.chartOptions = {
	animation: {
		startup: true,
	},
	chart: {
		title: 'Unique Visitors from Search',
	},
	statsColor: '#5c9271',
	curveType: 'function',
	height: 270,
	width: '100%',
	chartArea: {
		height: '80%',
		left: 30,
		right: 0,
	},
	legend: {
		position: 'top',
		textStyle: {
			color: '#616161',
			fontSize: 12,
		},
	},
	hAxis: {
		format: 'M/d/yy',
		gridlines: {
			color: '#fff',
		},
		textStyle: {
			color: '#616161',
			fontSize: 12,
		},
	},
	vAxis: {
		gridlines: {
			color: '#eee',
		},
		minorGridlines: {
			color: '#eee',
		},
		textStyle: {
			color: '#616161',
			fontSize: 12,
		},
		titleTextStyle: {
			color: '#616161',
			fontSize: 12,
			italic: false,
		},
		viewWindow: {
			min: 0,
		},
	},
	focusTarget: 'category',
	crosshair: {
		color: 'gray',
		opacity: 0.1,
		orientation: 'vertical',
		trigger: 'both',
	},
	tooltip: {
		isHtml: true, // eslint-disable-line sitekit/acronym-case
		trigger: 'both',
	},
};

export default WPDashboardUniqueVisitorsChartWidget;
