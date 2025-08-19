import TimeSelectionModule from '../TimesDatesModule/TimeSelectionModule'
import ManualDataGrid from './ManualDataGrid'
import { useAppDispatch } from '../../redux/reduxHooks'
import { toggleManualDataGrid } from '../../redux/reducers/utilsReducer'
import Icon from '../../components/icon'

function ManualDataGridContainer() {
    const dispatch = useAppDispatch()
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40">
            <div className="flex flex-col relative overflow-scroll h-screen max-w-screen-2xl md:h-[85%] md:w-[90%] md:max-h-[810px] md:top-16 md:border md:mx-auto md:shadow-lg md:rounded-md bg-white">
                <div className="md:sticky h-26 w-full md:w-auto top-0 z-40">
                    <button
                        type="button"
                        id="close"
                        onClick={() => dispatch(toggleManualDataGrid())}
                        className="absolute right-4 top-4 z-50"
                    >
                        <Icon iconId="TfiClose" />
                    </button>
                    <TimeSelectionModule showDateTimeTabs={false} />
                </div>
                <ManualDataGrid />
            </div>
        </div>
    )
}

export default ManualDataGridContainer
