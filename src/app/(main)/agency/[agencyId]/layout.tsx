import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized/unauthorized'
import { getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
type Props = {
    children: React.ReactNode,
    params: {agencId: string}
}
const layout =  async ({children, params}: Props) => {
    const agencyId = await verifyAndAcceptInvitation()
    const user = await currentUser()
    if(!user) return redirect('/')
    if(!agencyId){
        return redirect('/agency')
    }
    if(user.privateMetadata.role!== 'AGENCY_OWNER' && user.privateMetadata.role !== 'AGENCY_ADMIN'){
        return <Unauthorized/>
    }
    let allNot: any = []
  const notifications = await getNotificationAndUser(agencyId)
  if(notifications) allNot = notifications;
  return <div className='h-screen overflow-hidden'>
    <Sidebar id={params.agencId} type='agency' />
    <div className='md:pl-[300px]'></div>
  </div>
  
}

export default layout
