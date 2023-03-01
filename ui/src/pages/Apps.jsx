import { Helmet } from 'react-helmet';
import NM from '../components/NM';

function Apps() {
  const title = 'Next Morning Values';

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="container-fluid">
        <div
          className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
	  <NM />
        </div>
      </div>
    </>
  );
}

export default Apps;
