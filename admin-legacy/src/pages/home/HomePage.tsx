import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {}

const HomePage = (props: Props) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/properties')
  }, [])
  return <></>
}

export default HomePage
