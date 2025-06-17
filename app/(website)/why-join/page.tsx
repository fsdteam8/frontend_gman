import PageHeader from '@/components/sheard/PageHeader'
import React from 'react'
import Reasons from './_component/Reasons'

const page = () => {
  return (
    <div>
      <PageHeader imge='/asset/banner1.png' titile="Join the Food Revolution with Tablefresh" subtitle='Discover the benefits of joining our community of local farmers and health-conscious consumers. '/>
      <Reasons/>
    </div>
  )
}

export default page