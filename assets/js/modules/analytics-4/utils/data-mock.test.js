/**
 * Data mock tests.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
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
 * Internal dependencies
 */
import { getAnalytics4MockResponse } from './data-mock';
import mockedReportResponse from './__fixtures__/mocked-report.json';
import mockedReportMultipleDateRangesResponse from './__fixtures__/mocked-report-multiple-date-ranges.json';
import mockedReportFixedValueDimensionResponse from './__fixtures__/mocked-report-fixed-value-dimension.json';
import mockedReportMultipleDimensionResponse from './__fixtures__/mocked-report-multiple-dimensions.json';
import mockedReportOrderByMetricAscendingResponse from './__fixtures__/mocked-report-order-by-metric-ascending.json';
import mockedReportOrderByMetricDescendingResponse from './__fixtures__/mocked-report-order-by-metric-descending.json';
import mockedReportOrderByDimensionAscendingResponse from './__fixtures__/mocked-report-order-by-dimension-ascending.json';
import mockedReportOrderByDimensionDescendingResponse from './__fixtures__/mocked-report-order-by-dimension-descending.json';
import mockedReportOrderByMetricsAndDimensionsResponse from './__fixtures__/mocked-report-order-by-metrics-and-dimensions.json';

describe( 'getAnalytics4MockResponse', () => {
	it( 'throws if called without report options', () => {
		expect( () => getAnalytics4MockResponse() ).toThrow(
			'report options are required'
		);
	} );

	it( 'throws if called without a valid startDate', () => {
		expect( () =>
			getAnalytics4MockResponse( { startDate: 'not-a-date' } )
		).toThrow( 'a valid startDate is required' );
	} );

	it( 'throws if called without a valid endDate', () => {
		expect( () =>
			getAnalytics4MockResponse( {
				endDate: 'not-a-date',
				startDate: '2020-12-31',
			} )
		).toThrow( 'a valid endDate is required' );
	} );

	it( 'generates a valid report', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-29',
			endDate: '2021-01-02',
			metrics: [
				{
					name: 'sessions',
				},
				{
					name: 'newUsers',
				},
			],
			dimensions: [ 'date' ],
		} );

		expect( report ).toEqual( mockedReportResponse );

		// Verify the correct number of rows for the date range.
		expect( report.rows ).toHaveLength( 5 );
	} );

	it( 'generates a valid report with multiple date ranges', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-03',
			compareStartDate: '2020-12-04',
			compareEndDate: '2020-12-05',
			metrics: [
				{
					name: 'totalUsers',
				},
				{
					name: 'averageSessionDuration',
				},
			],
			dimensions: [ 'date' ],
		} );

		expect( report ).toEqual( mockedReportMultipleDateRangesResponse );

		// Verify the correct number of rows for the date ranges.
		expect( report.rows ).toHaveLength( 10 );
	} );

	it( 'generates a valid report using a dimension with a fixed set of values', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-03',
			compareStartDate: '2020-12-04',
			compareEndDate: '2020-12-05',
			metrics: [
				{
					name: 'totalUsers',
				},
				{
					name: 'averageSessionDuration',
				},
			],
			dimensions: [ 'sessionDefaultChannelGrouping' ],
		} );

		expect( report ).toEqual( mockedReportFixedValueDimensionResponse );

		// Verify the correct number of rows for the date ranges.
		expect( report.rows ).toHaveLength( 20 );
	} );

	it( 'generates a valid report using a multiple dimensions', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-03',
			compareStartDate: '2020-12-04',
			compareEndDate: '2020-12-05',
			metrics: [
				{
					name: 'totalUsers',
				},
				{
					name: 'averageSessionDuration',
				},
			],
			dimensions: [ 'deviceCategory', 'sessionDefaultChannelGrouping' ],
		} );

		expect( report ).toEqual( mockedReportMultipleDimensionResponse );

		// Verify the correct number of rows for the date ranges.
		expect( report.rows ).toHaveLength( 60 );
	} );

	it( 'generates the same number of rows for each date range in a multi-date range report', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-15',
			compareStartDate: '2020-11-26',
			compareEndDate: '2020-11-30',
			metrics: [
				{
					name: 'totalUsers',
				},
				{
					name: 'averageSessionDuration',
				},
				'sessions',
			],
			dimensions: [ 'date' ],
		} );

		const dateRangeZero = report.rows.filter( ( { dimensionValues } ) =>
			dimensionValues.find(
				( dimensionValue ) => dimensionValue.value === 'date_range_0'
			)
		);

		const dateRangeOne = report.rows.filter( ( { dimensionValues } ) =>
			dimensionValues.find(
				( dimensionValue ) => dimensionValue.value === 'date_range_1'
			)
		);

		expect( dateRangeZero ).toHaveLength( dateRangeOne.length );
	} );

	it( 'sorts by metric in ascending order', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-05',
			metrics: [
				{
					name: 'totalUsers',
				},
				{
					name: 'averageSessionDuration',
				},
			],
			dimensions: [
				{
					name: 'date',
				},
			],
			orderby: [
				{
					metric: {
						metricName: 'totalUsers',
					},
					desc: false,
				},
			],
		} );

		expect( report ).toEqual( mockedReportOrderByMetricAscendingResponse );
	} );

	it( 'sorts by metric in descending order', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-05',
			metrics: [
				{
					name: 'totalUsers',
				},
				{
					name: 'averageSessionDuration',
				},
			],
			dimensions: [
				{
					name: 'date',
				},
			],
			orderby: [
				{
					metric: {
						metricName: 'averageSessionDuration',
					},
					desc: true,
				},
			],
		} );

		expect( report ).toEqual( mockedReportOrderByMetricDescendingResponse );
	} );

	it( 'sorts by dimension in ascending order', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-05',
			metrics: [
				{
					name: 'totalUsers',
				},
			],
			dimensions: [
				{
					name: 'date',
				},
				{
					name: 'sessionDefaultChannelGrouping',
				},
			],
			orderby: [
				{
					dimension: {
						dimensionName: 'date',
					},
					desc: false,
				},
			],
		} );

		expect( report ).toEqual(
			mockedReportOrderByDimensionAscendingResponse
		);
	} );

	it( 'sorts by dimension in descending order', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-05',
			metrics: [
				{
					name: 'totalUsers',
				},
			],
			dimensions: [
				{
					name: 'date',
				},
				{
					name: 'sessionDefaultChannelGrouping',
				},
			],
			orderby: [
				{
					dimension: {
						dimensionName: 'sessionDefaultChannelGrouping',
					},
					desc: true,
				},
			],
		} );

		expect( report ).toEqual(
			mockedReportOrderByDimensionDescendingResponse
		);
	} );

	it( 'sorts by a combination of metrics and dimensions, with multiple date ranges', () => {
		const report = getAnalytics4MockResponse( {
			startDate: '2020-12-01',
			endDate: '2020-12-02',
			compareStartDate: '2020-12-04',
			compareEndDate: '2020-12-05',
			metrics: [
				{
					name: 'totalUsers',
				},
				{
					name: 'averageSessionDuration',
				},
			],
			dimensions: [
				{
					name: 'date',
				},
				{
					name: 'sessionDefaultChannelGrouping',
				},
			],
			orderby: [
				{
					dimension: {
						dimensionName: 'date',
					},
					desc: false,
				},
				{
					metric: {
						metricName: 'totalUsers',
					},
					desc: true,
				},
			],
		} );

		expect( report ).toEqual(
			mockedReportOrderByMetricsAndDimensionsResponse
		);
	} );
} );
