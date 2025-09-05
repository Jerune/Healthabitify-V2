import AuthorizeWearableButton from '../../services/AuthorizeWearableButton';
import { OAUTH_SCOPES } from '../../services/oauthConfig';

function OuraButton() {
  return (
    <AuthorizeWearableButton
      url='https://cloud.ouraring.com/oauth/authorize'
      id='OBGZFELJOIDPH67I'
      scope={OAUTH_SCOPES.oura}
      name='oura'
    />
  );
}

function FitbitButton() {
  return (
    <AuthorizeWearableButton
      url='https://www.fitbit.com/oauth2/authorize'
      id='238Z6R'
      scope={OAUTH_SCOPES.fitbit}
      name='fitbit'
    />
  );
}

function PolarButton() {
  return (
    <AuthorizeWearableButton
      url='https://flow.polar.com/oauth2/authorization'
      id='238Z6R'
      scope={OAUTH_SCOPES.polar}
      name='polar'
    />
  );
}

export { FitbitButton, OuraButton, PolarButton };
