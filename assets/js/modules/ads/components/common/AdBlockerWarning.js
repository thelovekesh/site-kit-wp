/**
 * Ads AdBlockerWarning component.
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
 * Internal dependencies
 */
import Data from 'googlesitekit-data';

import { MODULES_ADS } from '../../datastore/constants';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import AdBlockerWarningMessage from '../../../../components/AdBlockerWarningMessage';
const { useSelect } = Data;

export default function AdBlockerWarning() {
	const adBlockerWarningMessage = useSelect( ( select ) =>
		select( MODULES_ADS ).getAdBlockerWarningMessage()
	);
	const getHelpLink = useSelect( ( select ) =>
		select( CORE_SITE ).getDocumentationLinkURL( 'ads-ad-blocker-detected' )
	);

	return (
		<AdBlockerWarningMessage
			getHelpLink={ getHelpLink }
			warningMessage={ adBlockerWarningMessage }
		/>
	);
}
