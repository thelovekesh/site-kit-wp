/**
 * Ads Settings Setup Incomplete component.
 *
 * Site Kit by Google, Copyright 2024 Google LLC
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
import { Fragment, createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import Link from '../../../../components/Link';
import { CORE_MODULES } from '../../../../googlesitekit/modules/datastore/constants';
import { MODULES_ADS } from '../../datastore/constants';
import { AdBlockerWarning } from '../common';
const { useSelect } = Data;

export default function SettingsSetupIncomplete() {
	const adminReauthURL = useSelect( ( select ) =>
		select( MODULES_ADS ).getAdminReauthURL()
	);
	const requirementsError = useSelect( ( select ) =>
		select( CORE_MODULES )?.getCheckRequirementsError( 'ads' )
	);

	return (
		<Fragment>
			<div className="googlesitekit-settings-module__fields-group googlesitekit-settings-module__fields-group--no-border">
				<AdBlockerWarning />
			</div>

			{ createInterpolateElement(
				__(
					'Setup incomplete: <a>continue module setup</a>',
					'google-site-kit'
				),
				{
					a: (
						<Link
							className="googlesitekit-settings-module__edit-button"
							href={ adminReauthURL }
							disabled={ requirementsError ? true : false }
						/>
					),
				}
			) }
		</Fragment>
	);
}
