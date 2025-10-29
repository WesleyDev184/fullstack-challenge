import Header from '@/components/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_ptd')({
  component: PtdLayout,
})

function PtdLayout() {
  return (
    <>
      <Header />
      <div className='h-[calc(100vh-6vh)] max-h-[calc(100vh-6vh)] flex flex-col'>
        <Outlet />
      </div>
    </>
  )
}
