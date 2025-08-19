import AuthorizeWearableButton from '../../services/AuthorizeWearableButton'

function OuraButton() {
    return (
        <AuthorizeWearableButton
            url="https://cloud.ouraring.com/oauth/authorize"
            id="OBGZFELJOIDPH67I"
            scope="daily heartrate workout session"
            name="oura"
        />
    )
}

function FitbitButton() {
    return (
        <AuthorizeWearableButton
            url="https://www.fitbit.com/oauth2/authorize"
            id="238Z6R"
            scope="activity cardio_fitness heartrate electrocardiogram oxygen_saturation respiratory_rate sleep temperature weight settings"
            name="fitbit"
        />
    )
}

function GoogleSheetsButton() {
    return (
        <AuthorizeWearableButton
            url="https://accounts.google.com/o/oauth2/auth"
            id="508872663265-irct9hid1o4dldbulsg2r0tt8lg7obaq.apps.googleusercontent.com"
            scope="https://www.googleapis.com/auth/spreadsheets.readonly"
            name="gsheets"
        />
    )
}

export { OuraButton, FitbitButton, GoogleSheetsButton }
