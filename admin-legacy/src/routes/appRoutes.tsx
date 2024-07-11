import React from 'react'
import HomePage from '../pages/home/HomePage'
import { RouteType } from './config'
import GroupIcon from '@mui/icons-material/Group'
import User from '../pages/user/user'
import UserForm from '../pages/user/userForm'
import Properties from '../pages/Properties/Properties'
import Roles from '../pages/Roles/Roles'
import CameraRollIcon from '@mui/icons-material/CameraRoll'
import BusinessIcon from '@mui/icons-material/Business';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import NightShelterIcon from '@mui/icons-material/NightShelter';

import RoleForm from '../pages/Roles/RolesForm'
import PropertiesForm from '../pages/Properties/PropertiesForm'
import PropertiesDetails from '../pages/Properties/PropertiesDetails'
import UserDetails from '../pages/user/UserDetails'
import Organizations from '../pages/Organzations/Organizations'
import OrganizationForm from '../pages/Organzations/OrganizationForm'
import OrganizationDetails from '../pages/Organzations/Organization.Details'
import Areas from "../pages/areas/areas";
import AreasForm from "../pages/areas/areasForm";
import AssetForm from "../pages/assets/assetForm";
import MasterBusinessModel from "../pages/masterBusinessModel/masterBusinessModel";

const appRoutes: RouteType[] = [
  {
    path: '/',
    element: <HomePage />,
    state: 'home',
  },
  {
    path: '/properties',
    element: <Properties />,
    state: 'component.propeties',
    sidebarProps: {
      displayText: 'Properties',
      icon: <NightShelterIcon />,
    },
  },
  {
    path: '/users',
    element: <User />,
    state: 'user',
    sidebarProps: {
      displayText: 'Users',
      icon: <GroupIcon />,
    },
  },
  {
    path: '/roles',
    element: <Roles />,
    state: 'roles',
    sidebarProps: {
      displayText: 'Roles',
      icon: <CameraRollIcon />,
    },
  },
  {
    path: '/organizations',
    element: <Organizations />,
    state: 'organizations',
    sidebarProps: {
      displayText: 'Organizations',
      icon: <BusinessIcon />,
    },
  },
  {
    path: '/areas',
    element: <Areas />,
    state: 'areas',
    sidebarProps: {
      displayText: 'Areas',
      icon: <LocationCityIcon />,
    },
  },
  {
    path: '/asset/upload',
    element: <AssetForm />,
    state: 'assetUpload',
    sidebarProps: {
      displayText: 'Upload Asset',
      icon: <FileUploadIcon />,
    },
  },
  {
    path: '/master-business-models',
    element: <MasterBusinessModel />,
    state: 'masterBusinessModels',
    sidebarProps: {
      displayText: 'Business Model',
      icon: <BusinessIcon />,
    },
  },
  {
    path: '/users/add',
    element: <UserForm />,
    state: 'userAdd',
  },
  {
    path: '/roles/:id',
    element: <RoleForm />,
    state: 'roleAdd',
  },
  {
    path: '/users/:id',
    element: <UserForm />,
    state: 'usersAdd',
  },
  {
    path: `/properties/:id`,
    element: <PropertiesForm />,
    state: 'propertyAdd',
  },
  {
    path: '/properties/:id/details',
    element: <PropertiesDetails />,
    state: 'propertyDetails',
  },
  {
    path: '/users/:id/details',
    element: <UserDetails />,
    state: 'userDetails',
  },
  {
    path: '/organizations/add',
    element: <OrganizationForm />,
    state: 'organizationAdd',
  },
  {
    path: '/areas/add',
    element: <AreasForm />,
    state: 'AreaAdd',
  },
  {
    path: '/organizations/:id/details',
    element: <OrganizationDetails />,
    state: 'organizationDetails',
  },
  {
    path: '/organizations/:id/edit',
    element: <OrganizationForm />,
    state: 'organizationEdit',
  }
]

export default appRoutes
