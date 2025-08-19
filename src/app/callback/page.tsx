'use client'

import { useEffect } from "react"
import MainContent from "../../components/MainContent"
import DashBoardContainer from "../../features/Dashboard/DashBoardContainer"
import { useAppDispatch } from "../../redux/reduxHooks"
import { updateDeviceToken } from "../../redux/reducers/usersReducer"

function Callback() {
  const dispatch = useAppDispatch()
  const hash = window.location.hash.split('#access_token=')
  const token = hash[1].split('&')[0]

  console.log(hash)
  console.log(token)

  useEffect(() => {
    dispatch(updateDeviceToken({name: 'fitbit', token}))
  },[dispatch, token])

  return (
    <MainContent>
        <DashBoardContainer>
            <h2>Subscription renewed successfully</h2>
        </DashBoardContainer>
    </MainContent>
  )
}

export default Callback