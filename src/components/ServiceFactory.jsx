import DogWalkingComponent from './Services/DogWalkingComponent';

const ServiceFactory = ({ service }) => {

  //не нравится тут маппинг
  const SERVICE_TYPE_MAPPING = {
    'a3d4e5f6-7890-1234-5678-9abcdef01234': 'dogWalking',
  };
  const serviceType = SERVICE_TYPE_MAPPING[service.serviceTypeId];

  switch (serviceType) {
    case 'dogWalking':
      return <DogWalkingComponent service={service} />;
    default:
      return <>НОВЫЙ ВИД</>;
  }
};

export default ServiceFactory;