import * as React from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
// import Link from '@mui/material/Link';
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import styles from './Breadcrums.module.scss'
// import {
//   setActiveCategory,
//   setActiveSubCategory,
// } from '../../utils/globalStorage';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault()
  console.info('You clicked a breadcrumb.')
}

const BreadcrumbsComponent = () => {
  const location = useLocation()

  const [first, ...path] = location.pathname.split('/')

  const handleBreadClick = (item: string) => {
    console.log('you have clicked a breadcrumb', item)
    if (item === 'products') {
    }
  }
  return (
    <div onClick={handleClick} className={styles.container}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          // sx={{ border: 'none' }}
          // underline='hover'
          className={styles.link}
          color="inherit"
          to={'/'}
        >
          Home
        </Link>
        {path.slice(0, path.length - 1).map((item: any, index: number) => {
          return (
            <Link
              key={index}
              className={styles.link}
              // underline='hover'
              // color='inherit'
              to={'/' + [...path.slice(0, index), item].join('/')}
              onClick={() => handleBreadClick(item)}
            >
              {item}
            </Link>
          )
        })}

        {/* <Link
          underline='hover'
          color='inherit'
          href='/material-ui/getting-started/installation/'
        >
          Core
        </Link> */}
        <Typography color="text.primary" sx={{ textTransform: 'capitalize' }}>
          {path.at(-1)}
        </Typography>
      </Breadcrumbs>
    </div>
  )
}

export default BreadcrumbsComponent
