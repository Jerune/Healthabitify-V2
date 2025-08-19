import { Averages } from '../_types'

function calculateAutoAverages(allAverages: Averages) {
    const { AmountOfDeepSleep, AmountOfRemSleep, AmountOfSleep } = allAverages
    const TotalBeneficialSleep =
        Number(AmountOfDeepSleep) + Number(AmountOfRemSleep)
    const SleepCoificient = (TotalBeneficialSleep / Number(AmountOfSleep)) * 100

    return {
        TotalBeneficialSleep,
        SleepCoificient,
    }
}

export default calculateAutoAverages
