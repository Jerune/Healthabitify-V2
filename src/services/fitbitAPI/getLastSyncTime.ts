async function getLastSyncTime(token: string) {
    // API related Data
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }

    try {
        const response = await fetch('/api/fitbit/user/-/devices.json', headers)
        const responseData = await response.json()
        const date = responseData[0].lastSyncTime.split('T').slice(0, 1).join()

        return date
    } catch (error) {
        console.log(error)
    }

    return 'error'
}

export default getLastSyncTime
