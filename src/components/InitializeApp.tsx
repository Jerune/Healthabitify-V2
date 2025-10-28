/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

import buildAverages from '../features/AveragesManagement/buildAverages';
import createAveragesForNewPeriods from '../features/AveragesManagement/createAveragesForNewPeriods';
import getListWithNewPeriods from '../features/AveragesManagement/getListWithNewPeriods';
import addActivities from '../firebase/firestore/activities/addActivities';
import addDatapoints from '../firebase/firestore/data-points/addDatapoints';
import getMetrics from '../firebase/firestore/metrics/getMetrics';
import getWearables from '../firebase/firestore/wearables/getWearables';
import { initAverages } from '../redux/reducers/averagesReducer';
import { initMetrics } from '../redux/reducers/metricsReducer';
import { setDevices } from '../redux/reducers/usersReducer';
import {
  changeLoadingMessage,
  changeLoadingStatus,
} from '../redux/reducers/utilsReducer';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import extractFitbitActivities from '../services/fitbitAPI/extractFitbitActivities';
import transformFitbitData from '../services/fitbitAPI/transformFitbitData';
import getApiData from '../services/getApiData';
import transformBatchedOuraData from '../services/ouraAPI/transformBatchedOuraData';
import transformOuraData from '../services/ouraAPI/transformOuraData';
import { DataPoint, FitbitRawData, OuraRawData } from '../types';
//import { getYesterdaysDateAsString } from '../utils/getDatesAsString';
import { getYesterdaysDateAsString } from '../utils/getDatesAsString';
import { getDateTimeDataForPreviousPeriod } from '../utils/getDateTimeData';

function AppStateInit() {
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);
  const devices = useAppSelector(state => state.user.devices);
  const dispatch = useAppDispatch();
  const allMetrics = useAppSelector(state => state.metrics);

  async function initializeMetrics() {
    dispatch(changeLoadingMessage('Loading user settings...'));
    const metricList = await getMetrics();
    // Returns list of metrics or error message
    if (typeof metricList !== 'string') {
      dispatch(initMetrics(metricList));
    } else {
      toast.error(metricList);
    }
  }

  async function initializeWearables() {
    dispatch(changeLoadingMessage('Getting wearables information...'));
    const wearablesList = await getWearables();
    // Returns list of wearable data or error message
    if (typeof wearablesList !== 'string') {
      dispatch(setDevices(wearablesList));
    } else {
      console.error('Failed to load wearables:', wearablesList);
      toast.error(wearablesList);
    }
  }

  async function initializeServiceAPIs() {
    const yesterdayString = getYesterdaysDateAsString();
    // </-------------------------- FITBIT DATA UPDATE -----------------------------/>
    if (devices.fitbit.lastUpdated <= yesterdayString) {
      // Set loading message
      dispatch(changeLoadingMessage('Gathering Fitbit Data'));
      // Gets data for those dates from Fitbit API
      const fitbitDataFromAPI = (await getApiData(
        'fitbit',
        devices.fitbit.lastUpdated
      )) as FitbitRawData[];

      if (typeof fitbitDataFromAPI !== 'string') {
        // Set loading message
        dispatch(changeLoadingMessage('Transforming Fitbit data'));

        // </------- FITBIT DATAPOINTS FROM SUMMARY -------------/>

        // Transforms Fitbit data to a readable format if new data is returned
        const newFitbitDatapoints =
          await transformFitbitData(fitbitDataFromAPI);

        //Adds new datapoints to database
        if (newFitbitDatapoints.length > 0) {
          const newDataPromises = newFitbitDatapoints.map(async datapoint => {
            const amountOfNewDatapoints = await addDatapoints(datapoint);
            return amountOfNewDatapoints;
          });

          // Calculates amount of added datapoints
          const newDataCounts = await Promise.all(newDataPromises);
          const totalAmountOfNewDatapoints = newDataCounts.reduce(
            (sum, count) => sum + count,
            0
          );

          // Sends update on added datapoints
          toast.success(
            `${totalAmountOfNewDatapoints} new Fitbit datapoints have been added`
          );
        }

        // </------- FITBIT ACTIVITIES -------------/>

        // Set loading message
        dispatch(changeLoadingMessage('Extracting activity data'));

        const newFitbitActivities =
          await extractFitbitActivities(fitbitDataFromAPI);

        //Adds new activities to database
        if (newFitbitActivities.length > 0) {
          const amountOfNewDatapoints =
            await addActivities(newFitbitActivities);

          // Sends update on added activities
          toast.success(
            `${amountOfNewDatapoints} new activities have been added`
          );
        }
      } else if (fitbitDataFromAPI === 'error') {
        toast.error(
          'An error occured while getting the Fitbit Data, please try again later'
        );
      }
    }

    // </-------------------------- OURA DATA UPDATE -----------------------------/>
    if (devices.oura.lastUpdated <= yesterdayString) {
      // Set loading message
      dispatch(changeLoadingMessage('Gathering Oura Data'));

      const ouraDataFromAPI = (await getApiData(
        'oura',
        devices.oura.lastUpdated
      )) as OuraRawData[];

      if (
        typeof ouraDataFromAPI !== 'string' ||
        typeof ouraDataFromAPI[0] !== 'string'
      ) {
        dispatch(changeLoadingMessage('Transforming Oura data'));

        let newOuraDatapoints: DataPoint[] = [];

        // Check if this is batched data (multiple monthly responses)
        if (Array.isArray(ouraDataFromAPI) && ouraDataFromAPI.length > 1) {
          newOuraDatapoints = await transformBatchedOuraData(ouraDataFromAPI);
        } else {
          newOuraDatapoints = await transformOuraData(ouraDataFromAPI[0]);
        }

        if (newOuraDatapoints.length > 0) {
          const amountOfNewDatapoints = await addDatapoints(newOuraDatapoints);

          toast.success(
            `${amountOfNewDatapoints} new Oura datapoints have been added`
          );
        }
      } else if (
        ouraDataFromAPI[0] === 'error' ||
        ouraDataFromAPI === 'error'
      ) {
        console.error('Oura API returned error:', ouraDataFromAPI);
        toast.error(
          'An error occured while getting the Oura Data, please try again later'
        );
      }
    }
  }

  async function initializeAverages() {
    dispatch(changeLoadingMessage('Loading averages...'));
    // Get lastUpdated date with earliest date
    const earliestLastUpdated =
      devices.fitbit.lastUpdated < devices.oura.lastUpdated
        ? devices.fitbit.lastUpdated
        : devices.oura.lastUpdated;
    // Returns weekNumber, month & year of last finished! period based on earliestLastUpdated date
    const datesToCheckFor =
      getDateTimeDataForPreviousPeriod(earliestLastUpdated);
    // Checks for new weeks, months, years finalised
    const newPeriods = await getListWithNewPeriods(datesToCheckFor);
    // Creates new datapoints for the new periods and adds averages
    if (newPeriods.length > 0) {
      dispatch(changeLoadingMessage('Getting results for latest weeks'));
      const amountOfNewAverages = await createAveragesForNewPeriods(
        newPeriods,
        allMetrics
      );
      // Showing results in Toast

      toast.success(`${amountOfNewAverages} new averages have been calculated`);
    }
    // Builds all averages to be used in the app up to current date
    // Runs on 2 second timeout to make sure new averages have been added
    // To-Do: Find alternative for setTimeOut()
    setTimeout(async () => {
      const averageStoreData = await buildAverages(datesToCheckFor);
      dispatch(initAverages(averageStoreData));
    }, 2000);
  }

  async function manualAdjustments() {
    // Function that can be used to perform separate manual adjustments
  }

  async function initApp() {
    dispatch(changeLoadingStatus(true));
    await initializeMetrics();
    await initializeWearables();
    await manualAdjustments();
  }

  async function updateData() {
    dispatch(changeLoadingStatus(true));

    await initializeServiceAPIs();
    await initializeWearables();
    await initializeAverages();
  }

  useEffect(() => {
    if (isLoggedIn && allMetrics.length === 1) {
      initApp();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (devices.fitbit.lastUpdated && devices.oura.lastUpdated) {
      updateData();
    }
  }, [devices.fitbit.lastUpdated, devices.oura.lastUpdated]);

  return null;
}

export default AppStateInit;
