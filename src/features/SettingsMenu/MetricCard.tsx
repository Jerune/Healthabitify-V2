/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import Icon from '../../components/icon';
import metricsInMilliseconds from '../../data/metrics/metricsInMilliseconds';
import { updateMetric } from '../../redux/reducers/metricsReducer';
import { useAppDispatch } from '../../redux/reduxHooks';
import type { Metric, MetricProps } from '../../types';
import type { FormSubmit, InputEvent, SelectEvent } from '../../types.js';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

import SettingsButton from './SettingsButton';
import SettingsLabel from './SettingsLabel';

function MetricCard({ metric }: MetricProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(metric);
  const [editForm, setEditForm] = useState(false);
  const [detailsAreVisible, setDetailsAreVisible] = useState(false);
  const [inputValidationData, setInputValidationData] = useState({
    regEx: '^[0-9]*$',
    placeholder: '',
    typeReference: '',
  });

  // Constants
  const starIcon = formData.onDashboard ? (
    <Icon iconId='RiStarFill' />
  ) : (
    <Icon iconId='RiStarLine' />
  );
  const generalSelectStyles = `text-sm w-full select select-bordered font-normal ${
    !editForm && 'opacity-100 bg-gray-100 cursor-not-allowed'
  }`;
  const generalInputStyles = `text-sm w-full input input-bordered placeholder:italic ${
    !editForm && 'opacity-100 bg-gray-100 cursor-not-allowed'
  }`;

  useEffect(() => {
    switch (formData.dataType) {
      case 'amount':
        setInputValidationData({
          regEx: '^[0-9]+$',
          placeholder: 'ex. 2, 9, 58',
          typeReference: 'amount in complete numbers',
        });
        break;
      case 'duration':
        setInputValidationData({
          regEx: '^([0-9][0-9]):([0-5][0-9])$',
          placeholder: 'ex. 01:10',
          typeReference: 'duration in the HH:MM format',
        });
        break;
      case 'time':
        setInputValidationData({
          regEx: '^([01][0-9]|2[0-3]):([0-5][0-9])$',
          placeholder: 'ex. 13:32',
          typeReference: '24H time in HH:MM',
        });
        break;
      default:
        setInputValidationData({
          regEx: '^[0-9]+$',
          placeholder: '',
          typeReference: '',
        });
        break;
    }

    if (metricsInMilliseconds.includes(metric.id)) {
      setInputValidationData({
        regEx: '^([0-9][0-9]):([0-5][0-9])$',
        placeholder: 'ex. 01:10',
        typeReference: 'duration in the HH:MM format',
      });
    }
  }, [formData.dataType]);

  useEffect(() => {
    dispatch(updateMetric(formData));
  }, [formData.active, formData.onDashboard]);

  // Functions
  function handleChange(event: InputEvent | SelectEvent) {
    if (event.target.dataset.type) {
      const targetName: string = event.target.name;
      setFormData((prevFormData): Metric => {
        let keyValues = {};
        if (typeof prevFormData[targetName] === 'object') {
          keyValues = prevFormData[targetName];
        }
        return {
          ...prevFormData,
          [event.target.name]: {
            ...keyValues,
            [event.target.dataset.type]: event.target.value,
          },
        };
      });
    } else {
      setFormData(prevFormData => {
        return {
          ...prevFormData,
          [event.target.name]: event.target.value,
        };
      });
    }
  }

  async function handleSubmit(event: FormSubmit) {
    event.preventDefault();
    dispatch(updateMetric(formData));
    setEditForm(false);
    setDetailsAreVisible(false);
  }

  return (
    <form
      className={`w-full p-4 rounded-lg bg-white flex flex-col items-start justify-center gap-4 text-sm shadow-lg ${
        !detailsAreVisible
          ? 'hover:bg-palette-600 hover:text-white hover:italic hover:transition-colors'
          : 'bg-palette-600 bg-opacity-80'
      } ${!formData.active && 'opacity-50 hover:opacity-50'}`}
      onSubmit={handleSubmit}
    >
      <header className='flex flex-row w-full justify-start gap-4'>
        <button
          type='button'
          className={`rotate-90 ${formData.active ? 'visible' : 'invisible'}`}
          onClick={() => setDetailsAreVisible(!detailsAreVisible)}
        >
          {detailsAreVisible ? (
            <Icon iconId='AiOutlineDoubleLeft' />
          ) : (
            <Icon iconId='AiOutlineDoubleRight' />
          )}
        </button>

        <div className='flex flex-col grow'>
          <h3 className='text-lg flex flex-row items-center gap-1'>
            <span className='font-bold'>{formData.name}</span>
            {formData.unit && (
              <span className='text-sm italic'>({formData.unit})</span>
            )}
          </h3>
          <span>{capitalizeFirstLetter(formData.source)}</span>
        </div>
        <div className='flex justify-between items-end gap-2'>
          <input
            type='checkbox'
            className='toggle toggle-success'
            checked={formData.active}
            onChange={() => {
              setEditForm(false);
              setDetailsAreVisible(false);
              setFormData(prevState => {
                return {
                  ...prevState,
                  active: !prevState.active,
                  onDashboard: false,
                };
              });
            }}
          />
          <button
            className='text-2xl text-yellow-400'
            type='button'
            onClick={() => {
              if (formData.active) {
                setFormData(prevState => {
                  return {
                    ...prevState,
                    onDashboard: !formData.onDashboard,
                  };
                });
              }
            }}
          >
            {starIcon}
          </button>
        </div>
      </header>
      {detailsAreVisible && (
        <>
          <fieldset disabled={!editForm} className='w-full flex flex-col gap-4'>
            <div className='w-full flex flex-row gap-6 justify-between'>
              <div className='w-full flex flex-col max-w-[50%]'>
                <SettingsLabel name='dataType'>Type</SettingsLabel>
                <select
                  name='dataType'
                  className={generalSelectStyles}
                  value={formData.dataType}
                  onChange={handleChange}
                >
                  <option value='amount'>Amount</option>
                  <option value='time'>Time</option>
                  <option value='duration'>Duration</option>
                </select>
              </div>
              <div className='w-full flex flex-col max-w-[50%]'>
                <SettingsLabel name='frequency'>Frequency</SettingsLabel>
                <select
                  name='frequency'
                  className={generalSelectStyles}
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <option value='daily'>Daily</option>
                  <option value='weekly'>Weekly</option>
                </select>
              </div>
            </div>
            <div className='flex flex-col'>
              <SettingsLabel name='conditionsMode'>
                Conditions mode
              </SettingsLabel>
              <select
                name='conditionsMode'
                className={generalSelectStyles}
                value={formData.conditionsMode}
                onChange={handleChange}
              >
                <option value='higher'>Higher</option>
                <option value='lower'>Lower</option>
                <option value='range'>Range</option>
              </select>
            </div>
            {formData.conditionsMode === 'range' && (
              <div className='flex flex-col gap-4'>
                <div className='w-full flex flex-row gap-3 justify-end items-center'>
                  <i className='rounded-full h-5 w-5 min-h-5 min-w-5 bg-green-600' />
                  <select
                    className={`${generalSelectStyles} grow`}
                    name='good'
                    value={formData.good.mode}
                    onChange={handleChange}
                    data-type='mode'
                  >
                    <option value='More'>More</option>
                    <option value='Less'>Less</option>
                  </select>
                  <span className='w-8 flex justify-center'>than</span>
                  <input
                    className={`w-[30%] ${generalInputStyles}`}
                    required={formData.conditionsMode === 'range'}
                    name='good'
                    value={formData.good.value && formData.good.value}
                    onChange={handleChange}
                    data-type='value'
                    pattern={inputValidationData.regEx}
                    placeholder={inputValidationData.placeholder}
                  />
                </div>
                <div className='w-full flex flex-row gap-3 justify-end items-center'>
                  <i className='rounded-full h-5 w-5 min-h-5 min-w-5 bg-orange-600' />
                  <span className='flex grow justify-start pl-1'>Between</span>
                  <input
                    className={`${generalInputStyles} w-[30%]`}
                    required={formData.conditionsMode === 'range'}
                    name='medium'
                    value={formData.medium.value1 && formData.medium.value1}
                    onChange={handleChange}
                    data-type='value1'
                    pattern={inputValidationData.regEx}
                    placeholder={inputValidationData.placeholder}
                  />
                  <span className='w-8 flex justify-center'>and</span>
                  <input
                    name='medium'
                    className={`${generalInputStyles} w-[30%]`}
                    required={formData.conditionsMode === 'range'}
                    value={formData.medium.value2 && formData.medium.value2}
                    onChange={handleChange}
                    data-type='value2'
                    pattern={inputValidationData.regEx}
                    placeholder={inputValidationData.placeholder}
                  />
                </div>
                <div className='w-full flex flex-row gap-3 justify-end items-center'>
                  <i className='rounded-full h-5 w-5 min-h-5 min-w-5 bg-red-600' />
                  <select
                    className={`grow ${generalSelectStyles}`}
                    name='bad'
                    value={formData.bad.mode}
                    onChange={handleChange}
                    data-type='mode'
                  >
                    <option value='More'>More</option>
                    <option value='Less'>Less</option>
                  </select>
                  <span className='w-8 flex justify-center'>than</span>
                  <input
                    className={`${generalInputStyles} w-[30%]`}
                    required={formData.conditionsMode === 'range'}
                    name='bad'
                    value={formData.bad.value && formData.bad.value}
                    onChange={handleChange}
                    data-type='value'
                    pattern={inputValidationData.regEx}
                    placeholder={inputValidationData.placeholder}
                  />
                </div>
                <div className='text-orange-500 text-sm text-left'>
                  {`Format : ${inputValidationData.typeReference}`}
                </div>
              </div>
            )}

            <div className='w-full flex flex-col'>
              <SettingsLabel name='goal'>Goal</SettingsLabel>
              <input
                className={`${generalInputStyles}`}
                name='goal'
                value={formData.goal}
                onChange={handleChange}
              />
            </div>
          </fieldset>
          <div className='w-full flex flex-row gap-6'>
            <SettingsButton
              type='button'
              active={!editForm}
              text='Edit'
              onClick={() => setEditForm(true)}
            />
            <SettingsButton
              type='submit'
              active={editForm}
              text='Save'
              onClick={() => handleSubmit}
            />
          </div>
        </>
      )}
    </form>
  );
}

export default MetricCard;
