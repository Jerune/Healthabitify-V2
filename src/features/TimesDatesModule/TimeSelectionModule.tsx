/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import {
    changeActiveTimeView,
    changeDateTimeData,
} from '../../redux/reducers/utilsReducer'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks'
import { getSpecifiedDateAsString } from '../../utils/getDatesAsString'
import { getDateTimeDateFromDateString } from '../../utils/getDateTimeData'
import getAmountToAdjustWith from './getAmountToAdjustWith'
import getDateTitles from './getDateTitles'
import getWeekDays from './getWeekDays'
import type { DateTitles, TabListProps } from '../_types'
import Icon from '../../components/icon'
import Tabs from '@/data/tabs';

function TimeSelectionModule({
    tabs = Tabs,
    showDateTimeTabs = true,
    showDateSpecifications = true,
}: TabListProps) {
    const dispatch = useAppDispatch()
    const activeTimeView = useAppSelector((state) => state.utils.activeTimeView)
    const currentDateTimeAsString = useAppSelector(
        (state) => state.utils.currentDateTime.currentDate
    )
    const [dateTitle, setDateTitle] = useState<DateTitles>({
        week: '',
        month: '',
        year: '',
    })
    const currentDate = getDateTimeDateFromDateString(currentDateTimeAsString)

    const listOfTabs =
        tabs !== undefined &&
        tabs.map((tab, index) => {
            const buttonNames = ['week', 'month', 'year']
            const tabClasses =
                buttonNames[index] === activeTimeView
                    ? 'bg-palette-500 text-white hover:bg-palette-500'
                    : 'hover:bg-palette-500 hover:text-white'
            return (
                <li key={tab.name}>
                    <button
                        type="button"
                        className={`cursor-pointer border border-solid border-black px-6 py-2 ${tabClasses}`}
                        onClick={() => {
                            dispatch(changeActiveTimeView(buttonNames[index]))
                        }}
                    >
                        {tab.name}
                    </button>
                </li>
            )
        })

    async function setCorrectDates(date: DateTime) {
        const { weekNumber, month, year } = date
        const { firstDayOfTheWeek, lastDayOfTheWeek } = await getWeekDays(date)

        const newDates = {
            currentDate: date,
            weekNumber,
            month,
            year,
            firstDayOfTheWeek,
            lastDayOfTheWeek,
        }

        const newDatesAsStrings = {
            currentDate: getSpecifiedDateAsString(newDates.currentDate),
            weekNumber,
            month,
            year,
            firstDayOfTheWeek: getSpecifiedDateAsString(firstDayOfTheWeek),
            lastDayOfTheWeek: getSpecifiedDateAsString(lastDayOfTheWeek),
        }

        const titles = getDateTitles(newDates)
        setDateTitle(titles)
        dispatch(changeDateTimeData(newDatesAsStrings))
    }

    async function changeTimeView(direction: string, tabState: string) {
        const amountToAdjustWith = await getAmountToAdjustWith(tabState)
        if (direction === 'previous') {
            const newDate = currentDate.minus(amountToAdjustWith)
            setCorrectDates(newDate)
        } else if (direction === 'next') {
            const newDate = currentDate.plus(amountToAdjustWith)
            setCorrectDates(newDate)
        }
    }

    useEffect(() => {
        setCorrectDates(currentDate)
    }, [])

    return (
        <div className="w-full flex flex-col items-center p-4 md:p-6 rounded-lg bg-gray-50">
            {tabs !== undefined && showDateTimeTabs && (
                <ul className="flex items-center gap-3">{listOfTabs}</ul>
            )}
            {showDateSpecifications && (
                <div className="flex flex-row items-center pt-3 md:pt-6 -ml-8">
                    <DatePicker
                        onChange={(value) => {
                            if (value instanceof Date) {
                              setCorrectDates(DateTime.fromJSDate(value));
                            }
                          }}
                        value={currentDate.toJSDate()}
                        clearIcon=''
                        calendarIcon={<Icon iconId="TfiCalendar" />}
                    />
                    <button
                        className="pl-2"
                        type="button"
                        onClick={() =>
                            changeTimeView('previous', activeTimeView)
                        }
                    >
                        <Icon iconId="AiOutlineLeft" />
                    </button>
                    <span className="flex justify-center gap-6 px-8 italic">
                        {dateTitle[activeTimeView as keyof DateTitles]}
                    </span>
                    <button
                        type="button"
                        onClick={() => changeTimeView('next', activeTimeView)}
                    >
                        <Icon iconId="AiOutlineRight" />
                    </button>
                </div>
            )}
        </div>
    )
}

TimeSelectionModule.defaultProps = {
    showDateTimeTabs: true,
    showDateSpecifications: true,
}

export default TimeSelectionModule
