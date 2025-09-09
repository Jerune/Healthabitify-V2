import ManualDataGrid from '../../features/ManualDataGrid/ManualDataGrid';

export default function LabsPage() {
  return (
    <>
      <h1 className='py-2 pl-6 md:p-6 block text-xl md:text-4xl'>Labs</h1>
      <ManualDataGrid labs />
    </>
  );
}
