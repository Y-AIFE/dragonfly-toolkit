import Navbar from '@renderer/components/common/Navbar';

function App(): JSX.Element {
  return (
    <div className="border bg-gray-100 h-full w-full flex">
      <Navbar />
      <div className='flex-1'></div>
    </div>
  )
}

export default App
