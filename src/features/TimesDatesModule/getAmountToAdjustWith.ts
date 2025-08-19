function getAmountToAdjustWith(tabState: string) {
    let amountToAdjustWith = {}
    switch (tabState) {
        case 'week':
            amountToAdjustWith = { days: 7 }
            break
        case 'month':
            amountToAdjustWith = { month: 1 }
            break
        case 'year':
            amountToAdjustWith = { year: 1 }
            break
        default:
            amountToAdjustWith = {}
    }

    return amountToAdjustWith
}

export default getAmountToAdjustWith
