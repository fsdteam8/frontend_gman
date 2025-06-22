import PageHeader from '@/components/sheard/PageHeader'
import React from 'react'
import MissionTableFresh from './_component/MissionTableFresh'

const page = () => {
  return (
    <div>
      <PageHeader
        title="Our Mission"
        image="/asset/missionheader.jpg"
      />
      <MissionTableFresh/>
    </div>
  )
}

export default page