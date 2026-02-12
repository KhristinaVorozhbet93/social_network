import DogWalkingComponent from './Services/DogWalkingComponent';
import DogWalkingViewComponent from './Services/DogWalkingViewComponent';

const SERVICE_TYPE_IDS = {
  DOG_WALKING: 'a3d4e5f6-7890-1234-5678-9abcdef01234'
};

const ServiceFactory = ({ factoryType, service }) => {
  const { serviceTypeId } = service;

  switch (serviceTypeId) {
    case SERVICE_TYPE_IDS.DOG_WALKING:
      switch (factoryType) {
        case 'VIEW':
          return <DogWalkingViewComponent  service={service} />;
        case 'EDIT':
          return <DogWalkingComponent service={service} />;
        default:
          return <DogWalkingViewComponent service={service} />;
      }
  }
};

export default ServiceFactory;

export const FactoryType = {
  VIEW: 'VIEW',
  EDIT: 'EDIT'
};