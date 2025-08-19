// import { useEffect, useState } from 'react'
import MainContent from '../../../components/MainContent';
// import { useAppSelector } from '../../../redux/reduxHooks'
// import getActiveMetrics from '../../../features/DataGrid/getActiveMetrics'
// import buildColumns from '../../../features/DataGrid/buildColumns'
import Tabs from '../../../data/tabs';
import TimeSelectionModule from '../../../features/TimesDatesModule/TimeSelectionModule';

// import buildRows from '../../../features/DataGrid/buildRows'
// import Loading from '../../../components/Loading'
// import type { Column, Row } from '../../../features/_types'

async function DataPage({
  params,
}: {
  params: Promise<{ category?: string[] }>;
}) {
  const resolvedParams = await params;
  const { category } = resolvedParams;
  // const allMetrics = useAppSelector((state) => state.metrics)
  // const allAverages = useAppSelector((state) => state.averages)
  // const isLoading = useAppSelector((state) => state.utils.isLoading)
  // const activeTimeView = useAppSelector((state) => state.utils.activeTimeView)
  // const [activeColumns, setActiveColumns] = useState<Column[]>([])
  // const [activeRows, setActiveRows] = useState<Row[]>([])
  const title = category ? category.join('/') : 'Title';

  // useEffect(() => {
  //     async function setDataGrid() {
  //         if (category) {
  //             const activeMetrics = getActiveMetrics(allMetrics, category)
  //             const columns = await buildColumns(activeMetrics)
  //             const rows = buildRows(
  //                 activeMetrics,
  //                 activeTimeView,
  //                 allAverages
  //             )
  //             setActiveColumns(columns)
  //             setActiveRows(rows)
  //         }
  //     }
  //     if (!isLoading) {
  //         setDataGrid()
  //     }
  // }, [isLoading, category, activeTimeView])

  // if (isLoading) {
  //     return <Loading size={50} />
  // }

  return (
    <MainContent>
      <div className='flex justify-center md:block w-full md:w-auto absolute md:top-20 md:left-6 text-xl bottom-0 md:right-auto md:bottom-auto'>
        <h1 className='block text-xl md:text-4xl'>
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </h1>
      </div>
      <TimeSelectionModule tabs={Tabs} showDateSpecifications={false} />
      {/* <ReactDataGrid
                idProperty="id"
                columns={activeColumns}
                dataSource={activeRows}
                activateRowOnFocus={false}
                showHoverRows={false}
                showColumnMenuTool={false}
                showColumnMenuFilterOptions={false}
                showColumnMenuGroupOptions={false}
                resizable={false}
                className="w-full h-full"
            /> */}
    </MainContent>
  );
}

export default DataPage;
